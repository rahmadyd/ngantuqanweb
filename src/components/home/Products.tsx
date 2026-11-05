"use client";

import Image from "next/image";
import { Container } from "@/components/ui";
import { Button } from "@/components/ui";
import styles from "./Products.module.css";

interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  slug?: string;
  is_sold_out?: boolean;
  order_url?: string;
  order_label?: string;
}

interface ProductsProps {
  items: ProductItem[];
  ctaLabel: string;
  shopEnabled: boolean;
}

export function Products({ items, ctaLabel, shopEnabled }: ProductsProps) {
  if (!shopEnabled || items.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className={styles.section} aria-labelledby="products-title">
      <Container className={styles.container}>
        <div className={styles.grid} role="list">
          {items.map((item) => (
            <article key={item.id} className={styles.productCard} role="listitem">
              <div className={styles.imageWrapper}>
                {item.slug ? (
                  <a href={`/karya/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={300}
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </a>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.price}>{formatPrice(item.price)}</p>
                {item.is_sold_out ? (
                  <p className={styles.soldOut}>Habis</p>
                ) : item.order_url ? (
                  <a
                    href={item.order_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.orderLink}
                  >
                    <Button variant="primary" size="md">
                      {item.order_label || ctaLabel}
                    </Button>
                  </a>
                ) : (
                  <Button variant="primary" size="md" className={styles.orderBtn}>
                    {ctaLabel}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}