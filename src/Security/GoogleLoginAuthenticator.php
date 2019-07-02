<?php 
namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\Cache\Adapter\MemcachedAdapter;
use Doctrine\ORM\EntityManagerInterface;

class GoogleLoginAuthenticator extends AbstractGuardAuthenticator
{
    private $userManager;
    private $container;
    private $em;

    public function __construct(ContainerInterface $container, UserManagerInterface $userManager, EntityManagerInterface $em)
    {
        $this->userManager = $userManager;
        $this->container = $container;
        $this->em = $em;
    }
    
    public function supports(Request $request)
    {
        return $request->getPathInfo() == '/login_google';
    }

    public function getCredentials(Request $request)
    {
        $data = json_decode($request->getContent());
        $CLIENT_ID = '602981629590-c234p0kr2gn4qjo4qivid526vbedrfnp.apps.googleusercontent.com';
        $client = new \Google_Client(['client_id' => $CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
        $payload = $client->verifyIdToken($data->token);

        if (!$payload) { 
        	$this->failure = 'invalid id token';
        	throw new BadCredentialsException();       	
        }
        if (!$payload['email_verified']) {
            $this->failure = 'email not verified';
        	throw new BadCredentialsException();  
        }
        $this->email = $payload['email'];
        $request->getSession()->set(Security::LAST_USERNAME, $this->email);
        $this->referer = $request->headers->get('referer');

        return array(
            'email' => $this->email,
		);
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $email = $credentials['email'];
        $user = $this->user = $this->userManager->findUserByEmail($email);
        if(!$this->user){
        	$this->failure = 'bad e-mail';
        	throw new BadCredentialsException();
        }elseif( $user->isEnabled() == false && $user->getRoles()[0] != 'ROLE_DELETED'){
            $this->user_id = $user->getId();
       		$this->failure = 'inactive';
       		throw new DisabledException();
       	}elseif( $user->isEnabled() == false && $user->getRoles()[0] == 'ROLE_DELETED'){
            $this->user_id = $user->getId();
            $this->failure = 'deleted';
            throw new DisabledException();
        }
        else{
            $this->user_id = $user->getId();
       		return $user;
       	}
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        // already checked with google signin
	    return true;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // check if user is admin
        $is_admin = in_array('ROLE_ADMIN', $token->getUser()->getRoles());
 
    	$session=$request->getSession();
        $session->set('user_id', $token->getUser()->getId());
        $session->set('email', $token->getUser()->getEmail());
        $session->set('username', $token->getUser()->getUsername());
        //$session->set('name', $token->getUser()->getName());
        $session_info = [
            "username" => $token->getUser()->getUsername(),
            "email" => $token->getUser()->getEmail(),
            "session_id" => $session->getId(),
            'is_admin' => $is_admin,    
        ];

        //checks if there's an ad awaiting user to be registered
        // if yes inserts user info on ad table
        $pending_ad = false;
        if ($session->get('pending_ad_id')) {
            $pending_ad = true;
            $ad_repo = $this->em->getRepository(Ad::class);
            $ad = $ad_repo->findOneById($session->get('pending_ad_id'));
            $ad->setUser($this->user);
            $ad->setIsActive(1);
            $this->em->persist($ad);
            $this->em->flush();
            $session->remove('pending_ad_id');
        }

        $this->message = 'Vous êtes désormais connecté(e), ' . $this->user->getUsername();
        return new JsonResponse(
            array(
            	'status' => 'ok',
            	'message' => $this->message,
                'referer' => $this->referer,
                'session_info' => $session_info,
                'pending_ad' => $pending_ad,
                'user_id' => $token->getUser()->getId(),
            	)
        );
    }
    
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        if( $this->failure == 'inactive' ){
            //$email_sender = $this->container->get('app.send_email');
            //$this->inactiveFailure();
            $this->message = 'inactive';
        }else if( $this->failure == 'credentials' ){
            $this->message = 'Vos détails de connexion ne marchent pas. SVP de reessayer.';
        }else if( $this->failure == 'bad e-mail' || $this->failure == 'bad password'){
            $this->message = 'Vos détails de connexion ne correspondent pas. Veuillez réessayer.';
        }else if( $this->failure == 'deleted' ){
            $this->message = 'Votre compte a été supprimé.';
        }
        
        return new JsonResponse(
            array(
            	'status' => 'error',
            	'reason' => $this->failure, 
            	'message' => $this->message,
            	'referer' => $this->referer,
            	)
        );
    }
    
    /**
     * Called when authentication is needed, but it's not sent
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
    	
        $data = array(
            // you might translate this message
            'message' => 'Authentication Required'
        );

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
        
    }

    public function supportsRememberMe()
    {
        return true;
    }
}