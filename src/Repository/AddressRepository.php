<?php

namespace App\Repository;

use App\Entity\Address;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Address|null find($id, $lockMode = null, $lockVersion = null)
 * @method Address|null findOneBy(array $criteria, array $orderBy = null)
 * @method Address[]    findAll()
 * @method Address[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AddressRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Address::class);
        $this->em = $this->getEntityManager();
    }

    public function getAddressesWithinRadius ($radius, $lat, $lng) 
    {
        $query = $this->em->createQuery('SELECT a, ( 6371 * acos( cos( radians(:lat) ) * cos( radians( a.lat ) ) * cos( radians( a.lng ) - radians(:lng) )
        + sin( radians(:lat) ) * sin( radians( a.lat ) ) ) ) AS distance FROM App\Entity\Address a HAVING distance < :radius');
        $query->setParameter('radius', $radius);
        $query->setParameter('lat', $lat);
        $query->setParameter('lng', $lng);
        return $query->getArrayResult(); 
    }

    public function getCityPostalCode () 
    {
        $query = $this->em->createQueryBuilder();
        $query
            ->select('a.id', 'a.city', 'a.postalCode')
            ->from('App\Entity\Address', 'a')
            ->groupBy('a.city');
        return $query->getQuery()->getResult();
    }

//    /**
//     * @return Address[] Returns an array of Address objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    
    public function findOneByPostalCode($postal_code): ?Address
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.postalCode = :postal_code')
            ->setParameter('postal_code', $postal_code)
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleResult();
    }
    
}
