<?php 
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Cache\Adapter\MemcachedAdapter;

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
        $mem_conn = MemcachedAdapter::createConnection([
            'memcached://127.0.0.1:11211',
            'memcached://mem-pwa.x3qxvt.cfg.euw3.cache.amazonaws.com:11211']
        );
        $this->cache = new MemcachedAdapter($mem_conn,$namespace = ''); 
        $this->cacheid = 'session_idle_logout_flag';

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
        $payload = $data['payload'];
        /*
        $cached_flag = $this->cache->getItem($this->cacheid);
        //$this->cache->deleteItem($this->cacheid);
        //$cached_flag = $this->cache->getItem($this->cacheid);
        var_dump($cached_flag);
        exit;
        */
        if ($payload === 'set_session_idle_logout_flag') {
            $cached_flag = $this->cache->getItem($this->cacheid);
            $cached_flag->set(true);
            $this->cache->save($cached_flag);
            return $this->json(array(
                'status' => 'ok',
                'is_logged' => $is_logged,
                'is_admin' => $is_admin,
                'username' => $username,
            ));
        } else if ($payload === 'check_session_idle_logout_flag') {
            $cached_flag= $this->cache->getItem($this->cacheid);
            if ($cached_flag->isHit()) {
                $is_cached = $cached_flag->get();
                $cached_flag->set(false);
                $this->cache->save($cached_flag);
                if ($is_cached) {
                    return $this->json(array(
                        'status' => 'ok', 
                        'message' => 'idle_logout',
                        'is_logged' => $is_logged,
                        'is_admin' => $is_admin,
                        'username' => $username,
                    ));
                } else {
                    return $this->json(array(
                        'status' => 'ok', 
                        'message' => 'no_idle_logout',
                        'is_logged' => $is_logged,
                        'is_admin' => $is_admin,
                        'username' => $username,
                    ));
                }
            } else {
                return $this->json(array(
                    'status' => 'ok', 
                    'message' => 'no_idle_logout',
                    'is_logged' => $is_logged,
                    'is_admin' => $is_admin,
                    'username' => $username,
                ));
            }
        } else if ($payload === "extend" || $payload === 0) {
            if ($is_logged) {
                $session->set('last_active', time());
            }
            return $this->json(array(
                'status' => 'ok', 
                'last_active' => $session->get('last_active'),
                'is_logged' => $is_logged,
                'is_admin' => $is_admin,
                'username' => $username,
            ));
        } else if (preg_match('/^[1-9][0-9]*$/',$payload)) {
            // get session.active which is not updated by this route as per InitialierListener.php
            $last_active = $session->get('last_active');   
            $last_active_client = $payload;
            if ($last_active_client > $last_active) {
                $session->set('last_active', $last_active_client );
                $last_active = $last_active_client;
            }
            $session_id = $session->getId();
            return $this->json(array(
                'status' => 'ok', 
                'last_active' => $last_active,
                'is_logged' => $is_logged,
                'is_admin' => $is_admin,
                'username' => $username,
                "session_id" => $session_id,
            ));  
        } else if ($data == NULL) {
                return $this->json(array(
                    'status' => 'error', 
                    'last_active' => false,
                    'is_logged' => $is_logged,
                    'is_admin' => $is_admin,
                    'username' => $username,
                ));
        } 
    }
}