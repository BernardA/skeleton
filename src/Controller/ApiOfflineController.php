<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Security\FormLoginAuthenticator;
use Symfony\Component\HttpFoundation\Response;

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
                ), Response::HTTP_UNAUTHORIZED);
            }
        }

        $this->initialize();
        return $this->json(array(
            'isLogged' => $this->isLogged,
        ));
    }

    public function UserDataForOfflineAction(Request $request)
    {
        $this->initialize();
        if (!$this->isLogged) {
            return $this->json(array(
                'error' => "Accès interdit",
            ), Response::HTTP_UNAUTHORIZED);
        }
        $data = $request->getContent();
        $this->data = json_decode($data);
        $username = $this->user->getUsername();
        
        if ($this->data->username === $username) {
            $profile = $this->formLoginAuthenticator->getProfile($this->user);
            return $this->json(array(
                'profile' => $profile,
            ));
        } else {
            return $this->json(array(
                'type' => 'unknown',
                'errors' => 'Accès interdit',
            ), Response::HTTP_UNAUTHORIZED);
        }
    }
}
