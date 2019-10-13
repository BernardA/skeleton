<?php

namespace App\EventListener;

use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\FOSUserEvents;
use App\PwaBdaEvents;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use App\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Translation\TranslatorInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;

class PasswordResetSubscriber implements EventSubscriberInterface
{

    private $session;
    private $translator;
    private $userManager;
    private $router;

    public function __construct(SessionInterface $session,TranslatorInterface $translator, UserManagerInterface $userManager, RouterInterface $router)
    {
        $this->session = $session;
        $this->translator = $translator;
        $this->userManager = $userManager;
        $this->router = $router;
    }

    public function onSendEmailInitialize(GetResponseNullableUserEvent $event)
    {
        // if email does not exist it fails silently
        // sends a message as if as email has been sent
        // this to avoid malicious probing to check if user exists
        if (!$event->getUser()) {
            $message = "An email has been sent.";

            $response  = new JsonResponse(array(
                'message' => $message,
            ));  
            $event->setResponse($response); 
        }
    } 

    public function onSendEmailCompleted(GetResponseUserEvent $event)
    {
        $message = "An email has been sent. It contains a link you must click to reset your password.
        If you don't get an email check your spam folder or try again.";

        $response  = new JsonResponse(array(
            'message' => $message,
        ));  
        $event->setResponse($response);   
    }

    // this will stop FOS from building a form a sending it to twig in case of token being valid
    public function onResetInitialize(GetResponseUserEvent $event)
    {
        if ($event->getRequest()->isMethod('GET')) {
                $message = "";
                $response  = new JsonResponse(array(
                    'message' => $message,
                )); 
            $event->setResponse($response);
        } 
    }

    // this to handle invalid or null token
    public function onPasswordResetInitializeFailure(GetResponseEvent $event)
    {
        if ($event->getRequest()->isMethod('GET')) {
            $message = "Token expired or invalid.";

            $response  = new JsonResponse(array(
                'message' => $message,
            ), Response::HTTP_UNAUTHORIZED);  
            $event->setResponse($response);
        } 
    }

    public function onResettingResetSuccess(FormEvent $event)
    {
        $message = "Password succesfully reset.";

        $response  = new JsonResponse(array(
            'message' => $message,
        ));  
        $event->setResponse($response);
    }

    public static function getSubscribedEvents()
    {
        return [
            FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE => 'onSendEmailInitialize',
            FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED => 'onSendEmailCompleted',
            FOSUserEvents::RESETTING_RESET_SUCCESS => ['onResettingResetSuccess', -10],
            FOSUserEvents::RESETTING_RESET_INITIALIZE => ['onResetInitialize', -10],
            PwaBdaEvents::PASSWORD_RESET_INITIALIZE_FAILURE => 'onPasswordResetInitializeFailure'
        ];
    }
}