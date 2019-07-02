<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use App\Form\AttachmentType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Entity\Ad;
use App\Entity\User;
use App\Form\DataTransformers\ReceiverToStringTransformer;
use App\Form\DataTransformers\ThreadToIntegerTransformer;

class MessageType extends AbstractType
{
    private $transformerReceiver;
    private $transformerThread;

    public function __construct(ReceiverToStringTransformer $transformerReceiver, ThreadToIntegerTransformer $transformerThread)
    {
        $this->transformerReceiver = $transformerReceiver;
        $this->transformerThread = $transformerThread;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
                ->add('message', TextType::class)
                ->add('ad', EntityType::class, array(
                    'class' => Ad::class,
                ))
                ->add('receiver', TextType::class, array(
                    // validation message if the data transformer fails
                    'invalid_message' => 'That is not a valid receiver username',
                ))
                ->add('thread', IntegerType::class, array(
                    // validation message if the data transformer fails
                    'invalid_message' => 'That is not a valid message thread id',
                ))
                ->add('attachments', CollectionType::class,array(
                    'entry_type' => AttachmentType::class,
                    'allow_add' => true,
                    'allow_delete' => true,
                    'by_reference' => false,
                    'required' => false,
                ))
                ;
        $builder->get('receiver')
                ->addModelTransformer($this->transformerReceiver);
        $builder->get('thread')
                ->addModelTransformer($this->transformerThread);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'App\Entity\Message'
        ));
    }
    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'message';
    }
}