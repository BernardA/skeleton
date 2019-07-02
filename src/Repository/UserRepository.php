<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function setOldFailedLoginsToNull()
    {
        return $this->createQueryBuilder('u')
            ->update('App:User', 'u')
            ->set('u.lastFailedLoginAt', ':toNull')
            ->set('u.failedLogins', 0)
            ->where('u.lastFailedLoginAt < :window')
            ->setParameter('toNull', null)
            ->setParameter('window', new \DateTime('-60 minutes'))
            ->getQuery()
            ->execute()
        ;
    }

    public function getSumFailedLogins()
    {
        return $this->createQueryBuilder('u')
            ->select('SUM(u.failedLogins)')
            ->getQuery()
            ->getSingleScalarResult();
    }
 
    // /**
    //  * @return Page[] Returns an array of Page objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Page
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
