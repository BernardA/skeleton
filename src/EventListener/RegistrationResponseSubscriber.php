<?php

namespace App\EventListener;

use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\FOSUserEvents;
use App\PwaBdaEvents;
use FOS\UserBundle\Event\GetResponseUserEvent;
use App\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Translation\TranslatorInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use App\Service\MiscServices;
use Doctrine\ORM\EntityManagerInterface;

class RegistrationResponseSubscriber implements EventSubscriberInterface
{

    private $session;
    private $translator;
    private $userManager;
    private $router;
    private $miscServices;
    private $em;
    private $tokenGenerator;

    public function __construct(
        SessionInterface $session,
        TranslatorInterface $translator, 
        UserManagerInterface $userManager, 
        RouterInterface $router, 
        MiscServices $miscServices, 
        EntityManagerInterface $em,
        TokenGeneratorInterface $tokenGenerator
        )
    {
        $this->session = $session;
        $this->translator = $translator;
        $this->userManager = $userManager;
        $this->router = $router;
        $this->miscServices = $miscServices;
        $this->em = $em;
        $this->tokenGenerator = $tokenGenerator;
    }

    public function onRegistrationSuccess(FormEvent $event)
    {
        $flash = [];
        foreach ($this->session->getFlashBag()->get('success', array()) as $message) {
            $flash[] = $message;
        }
        // implement the functions from original FOS::RegistrationController::checkEmailAction
        $email = $this->session->get('fos_user_send_confirmation_email/email');
        $user = $this->userManager->findUserByEmail($email);
        $user->setEnabled(false);
        if (null === $user->getConfirmationToken()) {
            $user->setConfirmationToken($this->tokenGenerator->generateToken());
        }

        $this->session->remove('fos_user_send_confirmation_email/email');
        //$this->userManager->findUserByEmail($email) ? $user = true : $user = false;

        $response  = new JsonResponse(array(
            'status' => 'ok',
            'email' => $email,
            'username' => $user->getUsername(),
        ));  
        $event->setResponse($response);   
    }

    public function onRegistrationFailure(FormEvent $event)
    {
        $form = $event->getForm();
        $errors = $this->miscServices->getErrorMessages($form);
        $err_msg = array();
        foreach( $errors as $key => $val ){
            if( count(array_filter(array_keys($val), 'is_string')) > 0 ){
                foreach( $val as $key1 => $val1 ){
                    $err_msg[$key] = $val1[0];
                } 
            }else{
                $err_msg[$key] = $val[0];
            }
        }

        $response  = new JsonResponse(array(
            'status' => 'error',
            'errors' => $err_msg,
        ));  
        $event->setResponse($response);   
    }

    public function onRegistrationConfirm(GetResponseUserEvent $event)
    {
        $url = $this->router->generate('registration_result', array('status' => 'success'));
        $response = new RedirectResponse($url);
        $event->setResponse($response); 
    }

    public function onRegistrationConfirmFailure(GetResponseEvent $event)
    {
        $url = $this->router->generate('registration_result', array('status' => 'failed'));
        $response = new RedirectResponse($url);
        $event->setResponse($response); 
    }

    public static function getSubscribedEvents()
    {
        return [
            FOSUserEvents::REGISTRATION_SUCCESS => ['onRegistrationSuccess', -10],
            FOSUserEvents::REGISTRATION_FAILURE => 'onRegistrationFailure',
            FOSUserEvents::REGISTRATION_CONFIRM => 'onRegistrationConfirm',
            PwaBdaEvents::REGISTRATION_CONFIRM_FAILURE => 'onRegistrationConfirmFailure'
        ];
    }
}