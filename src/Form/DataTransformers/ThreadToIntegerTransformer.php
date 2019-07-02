<?php
namespace App\Form\DataTransformers;

//use App\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class ThreadToIntegerTransformer implements DataTransformerInterface
{
    private $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->em = $entityManager;
    }

    /**
     * Transforms an object (message) to a integer (thread_id).
     *
     * @param  Message|null $message
     * @return integer
     */
    public function transform($message)
    {
        if (null === $message) {
            return null;
        }

        return $message->getThread();
    }

    /**
     * Transforms an integer (thread_id) to an object (message).
     *
     * @param  integer $thread
     * @return Message|null
     * @throws TransformationFailedException if object (message) is not found.
     */
    public function reverseTransform($thread)
    {
        $this->repo = $this->em->getRepository(Message::class);
        $message = $this->repo->findOneBy(['id' => $thread]);

        if (null === $message) {
            // causes a validation error
            // this message is not shown to the user
            // see the invalid_message option
            throw new TransformationFailedException(sprintf(
                'A message with id "%s" does not exist!',
                $message
            ));
        }

        return $message;
    }
}