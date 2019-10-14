<?php
namespace App\Service;

class MiscServices
{
    public function getErrorMessages($form)
    {
        // https://stackoverflow.com/questions/6978723/symfony2-how-to-get-form-validation-errors-after-binding-the-request-to-the-fo/8216192#8216192

        $errors = array();

        foreach ($form->getErrors() as $key => $error) {
            if ($form->isRoot()) {
                $errors['#'][] = $error->getMessage();
            } else {
                $errors[] = $error->getMessage();
            }
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[] = [$child->getName() => str_replace('ERROR:', '', (string) $child->getErrors(true, false))];
            }
        }
        $err_msg = array();
        foreach( $errors as $error ){
            foreach ($error as $key => $val) {
                $err_msg[] = [$key => $val];
            }
        }
        return $errors;
    }
}
