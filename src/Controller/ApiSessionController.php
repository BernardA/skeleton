<?php 
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/* to handle logged in user inactivity
full comments on /client/pages/common/session_handler/index.js
*/

class ApiSessionController extends Controller
{

    public function getCsrfTokenAction(Request $request) {
        $session = $request->getSession();
        $csrfToken = $session->get('csrfToken');
        if ($csrfToken === null) {
            $csrfToken = bin2hex(random_bytes(32));
            $session->set('csrfToken', $csrfToken);
        }

        return $this->json(array(
            'csrfToken' => $csrfToken,
        ));
    }

    public function sessionIdleAction( Request $request)
    {   
        $this->em = $this->getDoctrine()->getManager();
        $securityContext = $this->container->get('security.authorization_checker');
        $is_logged =  $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED');
        $username = null;
        if ($is_logged) {
            $this->user = $this->getUser();
            $username = $this->user->getUsername();
        }
        $is_admin = $securityContext->isGranted('ROLE_ADMIN') ? true : false;
        $session = $request->getSession();
        $data = $request->getContent();
        $data = json_decode($data, true);
        return $this->json(array(
            'status' => 'ok', 
            'last_active' => $session->get('last_active'),
            'is_logged' => $is_logged,
            'is_admin' => $is_admin,
            'username' => $username,
        ));
    }
}