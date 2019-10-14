<?php

/*
 * This overrides FOSUserBundle ResettingController
 * https://stackoverflow.com/questions/48590862/override-registration-controller-with-fosuser-cannot-autowire-service-app-contr
 *
 */

namespace App\Controller;

use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use App\Event\GetResponseEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use App\PwaBdaEvents;
use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


/**
 * Controller managing the resetting of the password.
 *
 * @author Thibault Duplessis <thibault.duplessis@gmail.com>
 * @author Christophe Coevoet <stof@notk.org>
 */
class ResettingController extends Controller
{
    private $eventDispatcher;
    private $formFactory;
    private $userManager;
    private $tokenGenerator;
    private $mailer;

    /**
     * @var int
     * retryTtl default = 7200; // time in seconds before user can try to reset password again https://symfony.com/doc/current/bundles/FOSUserBundle/configuration_reference.html
     * it's left here but is innocous due to logic change
     */
    private $retryTtl;
    

    public function __construct(
        EventDispatcherInterface $eventDispatcher, 
        FactoryInterface $formFactory, 
        UserManagerInterface $userManager, 
        TokenGeneratorInterface $tokenGenerator, 
        MailerInterface $mailer,
        $retryTtl=7200
        )
    {
        $this->eventDispatcher = $eventDispatcher;
        $this->formFactory = $formFactory;
        $this->userManager = $userManager;
        $this->tokenGenerator = $tokenGenerator;
        $this->mailer = $mailer;
        $this->retryTtl = $retryTtl;
    }

    /**
     * Request reset user password: show form.
     * THIS IS FROM ORIGINAL FOS -> NOT USED IN THIS SCRIPT
     */
    public function requestAction()
    {
        return $this->render('@FOSUser/Resetting/request.html.twig');
    }

    /**
     * Request reset user password: submit form and send email.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function sendEmailAction(Request $request)
    {
        
        $username = $request->request->get('username');
        $user = $this->userManager->findUserByUsernameOrEmail($username);

        $event = new GetResponseNullableUserEvent($user, $request);
        $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }
        // this changes the standard behaviour of FOS
        // at this stage $user is not null, otherwise would be caught above
        // original code was null !== $user && !$user->isPasswordRequestNonExpired($this->retryTtl)

        $event = new GetResponseUserEvent($user, $request);
        $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        if (null === $user->getConfirmationToken()) {
            $user->setConfirmationToken($this->tokenGenerator->generateToken());
        }

        $event = new GetResponseUserEvent($user, $request);
        $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $this->mailer->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->userManager->updateUser($user);

        $event = new GetResponseUserEvent($user, $request);
        $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }
        // standard FOS removed
        //return new RedirectResponse($this->generateUrl('fos_user_resetting_check_email', array('username' => $username)));
    }

    /**
     * Tell the user to check his email provider.
     * THIS IS FROM ORIGINAL FOS -> NOT USED IN THIS SCRIPT
     *
     * @param Request $request
     *
     * @return Response
     */
    public function checkEmailAction(Request $request)
    {
        $username = $request->query->get('username');

        if (empty($username)) {
            // the user does not come from the sendEmail action
            return new RedirectResponse($this->generateUrl('fos_user_resetting_request'));
        }

        return $this->render('@FOSUser/Resetting/check_email.html.twig', array(
            'tokenLifetime' => ceil($this->retryTtl / 3600),
        ));
    }

    /**
     * Reset user password.
     *
     * @param Request $request
     * @param string  $token
     *
     * @return Response
     */
    public function resetAction(Request $request, $token)
    {
            $user = $this->userManager->findUserByConfirmationToken($token);

            if (null === $user) { 
                //change FOS's standard behavior and dispatches an event instead to be handled by PasswordResetSubscriber.php
                //return new RedirectResponse($this->container->get('router')->generate('fos_user_security_login'));
                $event = new GetResponseEvent($request);
                $pwa_bda = new PwaBdaEvents();
                $this->eventDispatcher->dispatch($pwa_bda::PASSWORD_RESET_INITIALIZE_FAILURE, $event);
                if (null !== $event->getResponse()) {
                    return $event->getResponse();
                }
            }

            $event = new GetResponseUserEvent($user, $request);

            // changed to only dispatch this event when method is GET
            // to avoid response not being null
            if ($event->getRequest()->isMethod('GET')){
                $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);

            }
            if (null !== $event->getResponse()) {
                return $event->getResponse();
            }

            $form = $this->formFactory->createForm();
            $form->setData($user);

            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $event = new FormEvent($form, $request);
                $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);

                $this->userManager->updateUser($user);

                if (null === $response = $event->getResponse()) {
                    $url = $this->generateUrl('fos_user_profile_show');
                    $response = new RedirectResponse($url);
                }

                $this->eventDispatcher->dispatch(
                    FOSUserEvents::RESETTING_RESET_COMPLETED,
                    new FilterUserResponseEvent($user, $request, $response)
                );

                return $response;
            }
            $event = new FormEvent($form, $request);
            $this->eventDispatcher->dispatch(PwaBdaEvents::RESETTING_RESET_FAILURE, $event);
            return $event->getResponse();
            /*
            return $this->render('@FOSUser/Resetting/reset.html.twig', array(
                'token' => $token,
                'form' => $form->createView(),
            ));
            */
    }
}
