<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use FOS\UserBundle\Model\UserManagerInterface;

class UtilsController extends Controller
{
    // PHP's in_array for multidimensional arrays
    // from https://stackoverflow.com/questions/4128323/in-array-and-multidimensional-array
    public function inArrayMultiDim($needle, $haystack, $strict = false) {
        foreach ($haystack as $item) {
            if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && $this->inArrayMultiDim($needle, $item, $strict))) {
                return true;
            }
        }
        return false;
    }
}




