<?php

/*
 * This file is copied from the FOSUserBundle package Events and adapted for the registration failure event
 *
 */

namespace App\Event;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\EventDispatcher\Event;
use Symfony\Component\HttpFoundation\Request;

class GetResponseEvent extends Event
{
    /**
     * @var Response
     */
    private $response;

    protected $request;

    public function __construct(Request $request)
    {
        $this->request= $request;
    }


    /**
     * @param Response $response
     */
    public function setResponse(Response $response)
    {
        $this->response = $response;
    }

    /**
     * @return Response|null
     */
    public function getResponse()
    {
        return $this->response;
    }
        
    /**
     * @return Request|null
     */
    public function getRequest()
    {
        return $this->request;
    }
}