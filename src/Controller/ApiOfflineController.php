<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Security\FormLoginAuthenticator;

class ApiOfflineController extends Controller
{
    private $formLoginAuthenticator;

    public function __construct(
        FormLoginAuthenticator $formLoginAuthenticator) {
        $this->formLoginAuthenticator = $formLoginAuthenticator;
    }

    public function initialize()
    {
        $this->isLogged = $this->isGranted('IS_AUTHENTICATED_FULLY');
        $this->isAdmin = false;
        if ($this->isLogged) {
            $this->user = $this->getUser();
            $this->isAdmin = in_array('ROLE_ADMIN', $this->user->getRoles());
        }
    }

    public function InitialDataForOfflineAction(Request $request)
    {
        // check xrsf token
        $headers = $request->headers->all();
        if (isset($headers["x-xsrf-token"])) {
            $requestToken = $headers["x-xsrf-token"][0];
            $session = $request->getSession();
            $sessionToken = $session->get('csrfToken');

            if ($requestToken != $sessionToken) {
                return $this->json(array(
                    'status' => 'error',
                    'error' => 'Invalid Token'
                ));
            }
        }

        $this->initialize();
        return $this->json(array(
            'status' => 'ok',
            'is_logged' => $this->isLogged,
        ));
    }

    public function UserDataForOfflineAction(Request $request)
    {
        $this->initialize();
        if (!$this->isLogged) {
            return $this->json(array(
                'status' => 'error',
                'error' => "Accès interdit",
            ));
        }
        $data = $request->getContent();
        $this->data = json_decode($data);
        $username = $this->user->getUsername();
        
        if ($this->data->username === $username) {
            $profile = $this->formLoginAuthenticator->getProfile($this->user);
            return $this->json(array(
                'status' => 'ok',
                'profile' => $profile,
            ));
        } else {
            return $this->json(array(
                'status' => 'error',
                'type' => 'unknown',
                'errors' => 'Accès interdit',
            ));
        }
    }
}
