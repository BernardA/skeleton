<?php
namespace App\EventListener;


use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

class InitializerListener
{

	private $event;
	private $eventR;
	private $em;
	public $response;

    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

   public function onKernelResponse( FilterResponseEvent $eventR )
    {
		$route = $eventR->getRequest()->get('_route');
		if ($eventR->isMasterRequest() && '_wdt' !== $route ) {
            $response  = $eventR->getResponse();
	        if( isset($this->setCookieVisitor) && $this->setCookieVisitor == 1 ){
	        	$response->headers->setCookie(new Cookie('visitor_own', time() + (365 * 24 * 60 * 60) ));
	        }
    	}
    }

	public function onKernelRequest( FilterControllerEvent $event )
	{	

		$route = $event->getRequest()->get('_route');
	    if ($event->isMasterRequest() && '_wdt' !== $route ) {
    		$session = $event->getRequest()->getSession();
    		$session->set('route', $route);
    		$cookies = $event->getRequest()->cookies;
            $this->setCookieVisitor = 0;
            // for this route, do not update last active to enable client side session check 
    		if($route != 'api_session'){
    			$this->sessionInit( $session, $cookies );
    		}
    	}
	}

    private function sessionInit( $session, $cookies )
    {
		$session->set('last_active', time() );

    }
}