<?php

namespace App\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="`user`")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @Assert\Length(min=5, max=50)
     */
    protected $username;

    /**
     * @Assert\NotBlank()
     * @Assert\Regex(
     *      pattern="/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,50})/",
     *      message="Password must be between 10-50 characters long and contain at least one digit, one upper case letter and one lower case letter and one symbol !@#$%^&* ",
     * )
     */
    protected $plainPassword;

    /**
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $firstName;

    /**
     * @ORM\Column(type="boolean")
     * @Assert\IsTrue(
     *  message = "L'acceptation de RGPD est requise"
     * )
     */
    private $rgpd;

    /**
     * @ORM\Column(type="integer", options={"default" : 0})
     */
    private $failedLogins;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastFailedLoginAt;

    /**
     * @ORM\Column(type="string", length=190, nullable=true)
     * @Assert\Email(
     *     message = "L'email '{{ value }}' n'est pas valide.",
     * )
     */
     
    private $oldEmail;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $emailUpdatedAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Address", inversedBy="users", cascade={"persist", "remove"})
     */
    private $address;



    public function __construct()
    {
        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * {@inheritdoc}
     */
    public function setPlainPassword($password)
    {
        $this->plainPassword = $password;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * {@inheritdoc}
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getRgpd(): ?bool
    {
        return $this->rgpd;
    }

    public function setRgpd(bool $rgpd): self
    {
        $this->rgpd = $rgpd;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getFailedLogins(): ?int
    {
        return $this->failedLogins;
    }

    public function setFailedLogins(int $failedLogins): self
    {
        $this->failedLogins = $failedLogins;

        return $this;
    }

    public function getLastFailedLoginAt(): ?\DateTimeInterface
    {
        return $this->lastFailedLoginAt;
    }

    public function setLastFailedLoginAt(?\DateTimeInterface $lastFailedLoginAt): self
    {
        $this->lastFailedLoginAt = $lastFailedLoginAt;

        return $this;
    }

    public function getOldEmail(): ?string
    {
        return $this->oldEmail;
    }

    public function setOldEmail(?string $oldEmail): self
    {
        $this->oldEmail = $oldEmail;

        return $this;
    }

    public function getEmailUpdatedAt(): ?\DateTimeInterface
    {
        return $this->emailUpdatedAt;
    }

    public function setEmailUpdatedAt(?\DateTimeInterface $emailUpdatedAt): self
    {
        $this->emailUpdatedAt = $emailUpdatedAt;

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }
}
