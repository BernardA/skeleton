<?php

namespace App;

/**
 * Contains all events thrown in the app.
 */
final class PwaBdaEvents
{
    /**
     * The REGISTRATION_CONFIRM_FAILURE event occurs when the registration token is null.
     *
     * This event allows the modification the standard behavior of FOSUserBundle, which throws an exception on FOSUserBundle/Controllers/RegistrationController.php
     * It uses the same GetResponseUserEvent from FOS and instead of an exception, sends a JSON response with the error.
     * 
     * @Event("App\Event\GetResponseEvent")
     */
    const REGISTRATION_CONFIRM_FAILURE = 'pwa_bda.registration.confirm.failure';

    /**
     * The PASSWORD_RESET_INITIALIZE_FAILURE event occurs when the reset confirmation token is null.
     * The term 'initialize' is kept to be consistent with FOS. 
     *
     * This event allows the modification the standard behavior of FOSUserBundle, which redirects to login in case of missing token
     * It uses the same GetResponseUserEvent from FOS and instead of an exception, sends a JSON response with the error.
     * 
     * @Event("App\Event\GetResponseEvent")
     */
    const PASSWORD_RESET_INITIALIZE_FAILURE = 'pwa_bda.password.reset.initialize.failure';

    /**
     * The RESETTING_RESET_FAILURE event occurs when the new password input is invalid.
     *
     * This event allows the modification the standard behavior of FOSUserBundle, which redirects to login in case of missing token
     * It uses the same GetResponseUserEvent from FOS and instead of an exception, sends a JSON response with the error.
     * 
     * @Event("App\Event\GetResponseEvent")
     */
    const RESETTING_RESET_FAILURE = 'pwa_bda.resetting.reset.failure';
}