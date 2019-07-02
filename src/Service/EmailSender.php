<?php 
namespace App\Service;

use Symfony\Component\Templating\EngineInterface;

class EmailSender
{
    private $mailer;
    private $templating;

    public function __construct( \Swift_Mailer $mailer, EngineInterface $templating) 
    { 
        $this->mailer = $mailer;
        $this->templating = $templating;
    }

    public function emailSenderAction($subject, $email_from, $email_to, $template, $params )
    {
        $message = (new \Swift_Message( $subject ))
            ->setFrom( $email_from )
            ->setTo( $email_to )
            ->setBody(
                $this->templating->render(
                    $template,
                    array('params' => $params)
                ),
                'text/html'
            );
        
        if (!$this->mailer->send($message, $failures))
        {
          return $failures;
        }
    }
}