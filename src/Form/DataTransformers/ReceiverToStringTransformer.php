<?php
namespace App\Form\DataTransformers;

//use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use FOS\UserBundle\Model\UserManagerInterface;

class ReceiverToStringTransformer implements DataTransformerInterface
{
    private $em;
    private $userManager;

    public function __construct(UserManagerInterface $userManager, EntityManagerInterface $entityManager)
    {
        $this->em = $entityManager;
        $this->userManager = $userManager;
    }

    /**
     * Transforms an object (user) to a string (receiver).
     *
     * @param  User|null $user
     * @return string
     */
    public function transform($user)
    {
        if (null === $user) {
            return '';
        }

        return $user->getUsername();
    }

    /**
     * Transforms a string (receiver) to an object (user).
     *
     * @param  string $receiver
     * @return User|null
     * @throws TransformationFailedException if object (user) is not found.
     */
    public function reverseTransform($receiver)
    {
        $user = $this->userManager->findUserBy(array('username' => $receiver));

        if (null === $user) {
            // causes a validation error
            // this message is not shown to the user
            // see the invalid_message option
            throw new TransformationFailedException(sprintf(
                'A user with username "%s" does not exist!',
                $receiver
            ));
        }

        return $user;
    }
}