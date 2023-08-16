// Uses the same styles as Product
import styles from "./Product.module.css";
import PageNav from '../components/PageNav/PageNave.jsx';
import Img2 from '../assets/img-2.jpg';

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <div>
          <h2>
            Simple pricing.
            <br />
            Just $9/month.
          </h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae vel
            labore mollitia iusto. Recusandae quos provident, laboriosam fugit
            voluptatem iste.
          </p>
        </div>
        <img src={Img2} alt="overview of a large city with skyscrapers" />
      </section>
    </main>
  );
}
