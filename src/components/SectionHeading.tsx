import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  centered?: boolean;
}

export default function SectionHeading({ title, children, subtitle, align = "center", centered }: SectionHeadingProps) {
  const finalAlign = centered ? "center" : align;
  return (
    <div className={`${styles.wrapper} ${styles[finalAlign]}`}>
      <h2 className={styles.title}>{title || children}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
