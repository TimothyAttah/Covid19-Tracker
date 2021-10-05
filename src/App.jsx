import React, { useEffect, useState } from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import "./App.css";

export const App = () => {
  const [ countries, setCountries ] = useState( [] );
  const [ country, setCountry ] = useState( 'worldwide' );

  useEffect( () => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
				.then(res => res.json())
				.then(data => {
					const countries = data.map(country => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					setCountries(countries);
				});
    }
    getCountriesData();
  }, [] )
  
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry( countryCode );
  }
  return (
		<div className='app'>
			<div className='app__header'>
				<h1>covid-19 tracker</h1>
				<FormControl className='app_dropdown'>
          <Select variant='outlined' value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide" >Worldwide</MenuItem>
						{countries.map(country => (
							<MenuItem value={country.value}>{country.name}</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
		</div>
	);
}
