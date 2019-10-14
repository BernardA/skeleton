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
//use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use App\Entity\Ad;
use App\Service\EmailSender;
use Symfony\Component\Cache\Adapter\MemcachedAdapter;
use Doctrine\ORM\EntityManagerInterface;

class FormLoginAuthenticator extends AbstractGuardAuthenticator
{
    const ALLOWED_FAILED_USER = 3;
    const FAILED_LOGIN_WINDOW = 300; // rolling 60 minutes 
    private $userManager;
    //private $mailer;
    private $tokenGenerator;
    private $container;

    public function __construct(ContainerInterface $container, UserManagerInterface $userManager, TokenGeneratorInterface $tokenGenerator, EntityManagerInterface $em)
    {
        $mem_conn = MemcachedAdapter::createConnection([
            'memcached://127.0.0.1:11211',
            'memcached://mem-pwa.x3qxvt.cfg.euw3.cache.amazonaws.com:11211']
        );
        $this->cache = new MemcachedAdapter($mem_conn,$namespace = ''); 
        $this->cacheid = 'pwa-failed_logins';
        $this->userManager = $userManager;
        $this->container = $container;
       // $this->mailer = $mailer;
        $this->tokenGenerator = $tokenGenerator;
        $this->em = $em;
	}

    public function supports(Request $request)
    {
        return $request->getPathInfo() == '/login_check';
    }

    public function getCredentials(Request $request)
    {
        $this->request = $request;
        //handle json data coming from axios
        $post = $this->transformJson($request->getContent());
        $this->email = $post['_email'];
        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL ) || $this->email == NULL){
        	$this->failure = 'bad e-mail';
        	throw new BadCredentialsException();
        }
        $request->getSession()->set(Security::LAST_USERNAME, $this->email);
        $password = $post['_password'];
        $this->referer = $request->headers->get('referer');
        if(!preg_match('/^.{8,50}$/',$password)){
        	$this->failure = 'bad password';
        	throw new BadCredentialsException();       	
        }
        return array(
            'email' => $this->email,
            'password' => $password
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
        $plainPassword = $credentials['password'];
        $encoder = $this->container->get('security.password_encoder');
        if (!$encoder->isPasswordValid($user, $plainPassword)){
            $this->failure='credentials';
            throw new BadCredentialsException();
		}else{
			return true;
		}
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
            "sessionId" => $session->getId(),
            'isAdmin' => $is_admin, 
            'isLogged' => true   
        ];

        //checks if there's an ad awaiting user to be registered
        // if yes inserts user info on ad table
        /*
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
*/
        //$profile = $this->getProfile($this->user);

        $this->message = 'Vous êtes désormais connecté(e), ' . $this->user->getUsername();
        $this->deleteFailedLoginsOnSuccess($token->getUser()->getEmail());
        return new JsonResponse(
            array(
                'referer' => $this->referer,
                'sessionInfo' => $session_info,
                //'pending_ad' => $pending_ad,
                'userId' => $token->getUser()->getId(),
                //'profile' => $profile,
            	)
        );
        
        // for non-AJAX requests, return the normal redirect
        //return parent::onAuthenticationSuccess($request, $token, $providerKey);
	}

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        if($this->isThrottle()) {
            // applies login delay
            $failed_login_throttle = 4; // seconds
            sleep($failed_login_throttle);
            $this->failure = 'throttle';
            $this->message = 'Vos détails de connexion ne marchent pas. SVP de reessayer.';
        } else {
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
        }

        return new JsonResponse(
            array(
            	'reason' => $this->failure, 
            	'message' => $this->message,
            ), Response::HTTP_UNAUTHORIZED
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

    public function inactiveFailure()
    {
    	$user = $this->user;
        $user->setEnabled(false);
        if (null === $user->getConfirmationToken()) {
            $user->setConfirmationToken($this->tokenGenerator->generateToken());
        }
        //$this->mailer->sendConfirmationEmailMessage($user);
    	//$em->persist($user);
        //$em->flush();
        //$sendEmail = new SendEmail();
    	//$sendEmail->sendEmailAction( $user );
    	$this->message = "Votre compte n'est pas activé. Un nouveau lien d'activation vient de vous être envoyé. SVP de vérifier votre boîte e-mail";
    }

    public function isThrottle()
    {
        $is_throttle = false;
        $cached_logins= $this->cache->getItem($this->cacheid);
        if (!$cached_logins->isHit()) { 
            $failed_logins = [];
            $failed_logins[$this->email][] = time();
            $cached_logins->set(array(
                $this->cacheid => $failed_logins
            ));
            $this->cache->save($cached_logins);
        } else {
            $failed_logins = $cached_logins->get();
            $failed_logins = $failed_logins[$this->cacheid];
            // delete expired failed logins
            foreach ($failed_logins as $email => $values) {
                foreach ($values as $index => $time) {
                    if ($time + self::FAILED_LOGIN_WINDOW < time()) {               
                        unset($failed_logins[$email][$index]);
                        // if there are no failed logins left for that e-mail, delete it
                        // else reindex array
                        if (count($failed_logins[$email]) == 0) {
                            unset($failed_logins[$email]);
                        } else {
                            array_values($failed_logins[$email]);
                        }   
                    }
                }
            }
            // replace update failed login data on bucket
            $failed_logins[$this->email][] = time();
            // update cache
            $this->cache->deleteItem($this->cacheid);
            $cached_logins->set(array(
                $this->cacheid => $failed_logins
            ));
            $this->cache->save($cached_logins);
            // count all failed logins
            $ct_failed_all = 0;
            foreach ($failed_logins as $email) {
                $ct_failed_all+= count($email);
            }
            // get failed login allowed from cache
            $this->cacheid_failed = 'pwa-failed_logins_allowed_all';
            $cached_allowed= $this->cache->getItem($this->cacheid_failed);
            if (!$cached_allowed->isHit()) {
                $failed_login_allowed_all = 10;
            } else {
                $failed_login_allowed_all = $cached_allowed->get();
                $failed_login_allowed_all = $failed_login_allowed_all[$this->cacheid_failed];
            }
            if ($ct_failed_all > $failed_login_allowed_all || count($failed_logins[$this->email]) > self::ALLOWED_FAILED_USER ) {
                $is_throttle = true;
            } 
        }
        return $is_throttle;
    }

    public function deleteFailedLoginsOnSuccess ($email) {
        $cached_logins= $this->cache->getItem($this->cacheid);
        if ($cached_logins->isHit()) {
            $failed_logins = $cached_logins->get();
            $failed_logins = $failed_logins[$this->cacheid];
            unset($failed_logins[$email]);
            $this->cache->deleteItem($this->cacheid);
            $cached_logins->set(array(
                $this->cacheid => $failed_logins
            ));
            $this->cache->save($cached_logins);
        }
    }

    public function transformJson($postJson)  
    {
        $postAsArray = [];
        $postAsArray = json_decode($postJson, true);
        return $postAsArray;
        
    }

    public function getProfile ($user) {
        $profile = [];
        $profile['id'] = $user->getId();
        $profile['username'] = $user->getUsername();
        $profile['email'] = $user->getEmail();
        $profile['address']['id'] = $user->getAddress()->getId();
        $profile['address']['address1'] = $user->getAddress()->getAddress1();
        $profile['address']['address2'] = $user->getAddress()->getAddress2();
        $profile['address']['address3'] = $user->getAddress()->getAddress3();
        $profile['address']['city'] = $user->getAddress()->getCity();
        $profile['address']['state'] = $user->getAddress()->getState();
        $profile['address']['postal_code'] = $user->getAddress()->getPostalCode();
        $profile['address']['lat'] = $user->getAddress()->getLat();
        $profile['address']['lng'] = $user->getAddress()->getLng();
        return $profile;
    } 
}