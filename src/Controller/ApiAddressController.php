<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Address;
use Doctrine\ORM\EntityManagerInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use App\Service\MiscServices;
use App\Security\FormLoginAuthenticator;

class ApiAddressController extends Controller
{
    private $userManager;
    private $em;
    private $miscServices;

    public function __construct(
        UserManagerInterface $userManager,
        EntityManagerInterface $entityManager,
        MiscServices $miscServices
    ) {
        $this->userManager = $userManager;
        $this->em = $entityManager;
        $this->miscServices = $miscServices;
    }

    public function initialise()
    {
        $this->isLogged = $this->isGranted('IS_AUTHENTICATED_FULLY');
        if ($this->isLogged) {
            $this->user = $this->getUser();
        }
        $this->repo = $this->em->getRepository(Address::class);
    }

    public function AddressInsertAction(Request $request)
    {
        $this->initialise();
        $address = new Address();
        $form = $this->createForm('App\Form\AddressType', $address);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $address = $form->getData();
            $this->em->persist($address);
            $this->em->flush();
            return $this->json(array(
                'status' => 'ok',
                'address_id' => $address->getId(),
            ));
        }
        $errors = $this->miscServices->getErrorMessages($form);
        return $this->json(array(
            'status' => 'error',
            'errors' => $errors,
        ));
    }

    public function AddressChangeAction(Request $request, FormLoginAuthenticator $formLoginAuthenticator)
    {
        $this->initialise();
        // check xrsf token
        $headers = $request->headers->all();
        $requestToken = $headers["x-xsrf-token"][0];
        $session = $request->getSession();
        $sessionToken = $session->get('csrfToken');

        if ($requestToken != $sessionToken) {
            return $this->json(array(
                'status' => 'error',
                'error' => 'Invalid Token'
            ));
        }
        if (!$this->isLogged) {
            $err_msg = [];
            $err_msg['not_allowed'] = 'You are not authorized to access this page';
            return $this->json(array(
                'status' => 'error',
                'is_logged' => $this->isLogged,
                'errors' => $err_msg,
            ));
        }
        $address = $this->user->getAddress();
        $form = $this->createForm('App\Form\AddressType', $address);

        try {
            $form->handleRequest($request);
            if ($form->isSubmitted() && $form->isValid()) {
                $address = $form->getData();
                $this->user->setAddress($address);
                $this->em->persist($address);
                $this->em->flush();
            }
            $profile = $formLoginAuthenticator->getProfile($this->user);

            return $this->json(array(
                'status' => 'ok',
                'profile' => $profile
            ));
        } catch (\Exception $e) {
            if (!$form->isValid()) {
                $errors = $this->miscServices->getErrorMessages($form);
                return $this->json(array(
                    'status' => 'error',
                    'errors' => $errors,
                    'errorException' => $e->getMessage(),
                ));
            }
        }
    }
}
