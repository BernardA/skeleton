<?php 
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class IndexController extends Controller
{

    public function index()
    {
        $number = mt_rand(0, 100);

        return $this->render('index.html.twig', array(
            'number' => $number,
        ));
    }

}