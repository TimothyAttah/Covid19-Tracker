import React, { useEffect, useState } from 'react';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import "./App.css";
import { InfoBox } from './components/infoBox/InfoBox';
import { Map } from './components/map/Map';
import { Table } from './components/table/Table';
import { sortData } from './components/util';
import { LineGraph } from './components/lineGraph/LineGraph';

export const App = () => {
  const [ countries, setCountries ] = useState( [] );
  const [ tableData, setTableData ] = useState( [] );
  const [ country, setCountry ] = useState( 'worldwide' );
	const [ countryInfo, setCountryInfo ] = useState( {} );
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [mapZoom, setMapZoom] = useState(3);

		useEffect(() => {
			fetch('https://disease.sh/v3/covid-19/all')
				.then(res => res.json())
				.then(data => {
					setCountryInfo(data);
				});
		}, [] );
	
  useEffect( () => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
				.then(res => res.json())
				.then(data => {
					const countries = data.map(country => ({
						name: country.country,
						value: country.countryInfo.iso2,
					} ) );
					const sortedData = sortData( data );
					setTableData(sortedData)
					setCountries(countries);
				});
    }
    getCountriesData();
  }, [] )
  
  const onCountryChange = async (e) => {
		const countryCode = e.target.value;
		const url =
		countryCode === 'worldwide'
		? 'https://disease.sh/v3/covid-19/all'
		: `https://disease.sh/v3/covid-19/countries/${countryCode}`
		await fetch( url )
		.then( res => res.json() )
			.then( data => {
			console.log('this is info', data);
				setCountry( countryCode );
				setCountryInfo( data );
				setMapCenter( [ data.countryInfo.lat, data.countryInfo.long ] );
				setMapZoom( 4 );
		})
  }
  return (
		<div className='app'>
			<div className='app__left'>
				<div className='app__header'>
					<h1>covid-19 tracker</h1>
					<FormControl className='app_dropdown'>
						<Select
							variant='outlined'
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem value='worldwide'>Worldwide</MenuItem>
							{countries.map(country => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className='app__stats'>
					<InfoBox
						title='CoronaVirus Cases'
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						title='Recovered'
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						title='Deaths'
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>
				<Map
					center={ mapCenter }
					zoom={mapZoom}
				/>
			</div>
			<div className='app__right'>
				<Card>
					<CardContent>
						<h3>Live Cases by Country</h3>
						<Table countries={tableData} />
						<h3>Worldwide new cases</h3>
						<LineGraph />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
