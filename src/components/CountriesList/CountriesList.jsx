import styles from './CountryList.module.css';
import Spinner from '../Spinner/Spinner.jsx';
import Message from '../Message/Message.jsx';
import CountryItem from '../CountryItem/CountryItem.jsx';
export default function CountriesList({cities = [],isLoading = false}) {

    const countries = cities.reduce((acc, city) => {
       if (!acc.map(el=>el.country).includes(city.country)) {
         return [...acc, {id: city.id, country: city.country, emoji: city.emoji}]
       } else {
              return acc
       }
    }, []);


    if (isLoading) {
        return <Spinner />
    }

    if (!countries.length) {
        return <Message
            message={'Add your first country by clicking on a country on the map'}
        />
    }

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem key={country.id} country={country} />
            ))}
        </ul>
    )
}