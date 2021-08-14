
const _ = elem => document.querySelector(elem);

const renderCurrencyAPI = function()
{
	_("#from-currency").innerHTML = "";
	_("#to-currency").innerHTML = "";
	const API_URL_CURRENCIES = 'https://free.currconv.com/api/v7/currencies?apiKey=c18676c72ff0fe4557d1';
	fetch(API_URL_CURRENCIES)
	.then( response => response.json())
	.then((data) => {
		const result = Object.values(data);
		const allCurrency = Object.values(result[0]);
		for(let currency of allCurrency)
		{
			if(currency.id === "USD")
			{
				_("#from-currency").innerHTML += `<option value=${currency.id} selected>${currency.id} - ${currency.currencyName}</option>`;
				_("#to-currency").innerHTML += `<option value=${currency.id}>${currency.id} - ${currency.currencyName}</option>`;
			}
			else if(currency.id == "NGN")
			{
				_("#from-currency").innerHTML += `<option value=${currency.id} >${currency.id} - ${currency.currencyName}</option>`;
				_("#to-currency").innerHTML += `<option value=${currency.id} selected>${currency.id} - ${currency.currencyName}</option>`;
			}
			else
			{
				_("#from-currency").innerHTML += `<option value=${currency.id}>${currency.id} - ${currency.currencyName}</option>`;
				_("#to-currency").innerHTML += `<option value=${currency.id}>${currency.id} - ${currency.currencyName}</option>`;
			}
		}
	})
	.catch((error)=>{
		console.log(error);
	})
}

const getOtherInfoAPI = function(fromID,toID,amount)
{
	_("#loader-wrapper").style.display = "flex";
	const conversion = [1,5,10,25,50,100,500,1000,5000,10000,5000,10000,50000];
	let query = fromID+"_"+toID;
	const API_URL_CONVERT = 'https://free.currconv.com/api/v7/convert?q='+query+'&compact=ultra&apiKey=c18676c72ff0fe4557d1';
	fetch(API_URL_CONVERT)
	.then( response =>response.json())
	.then((data)=>{
		_("#btn-convert").style.opacity = "1.0";
		_("#loader-wrapper").style.display = "none";
		_("#cont-output").style.display = "flex";
		_("#cont-further-info").style.display = "flex";
		_("#from").textContent = `${amount.toLocaleString()} ${fromID}`;
		_("#to").textContent = `${(amount * data[query]).toLocaleString()} ${toID}`;
		for(let item of conversion)
		{
			_("#conversion-info").innerHTML += `<div class='info-item'><span style='text-align:left'>${item.toLocaleString()} ${fromID}</span><span style='text-align:right'>${Number((item * data[query]).toFixed(2)).toLocaleString()} ${toID}</span></div>`;
		}
	})
	.catch((error)=>{
		console.log(error);
	})
}
window.addEventListener("DOMContentLoaded", ()=>{
	renderCurrencyAPI();
});
const getTimeStamp = function()
	{
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		let date = new Date();
		let day = date.getDate();
		let month = months[date.getMonth()];
		let year = date.getFullYear();
		let hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
		let minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes();
		let period = date.getHours() >= 12 ?"pm":"am";
		let today = days[date.getDay()];
		return `${today}<br>${month} ${day}, ${year}<br>${hour}:${minute} ${period}`;
	}

setInterval(()=>{
    let time = getTimeStamp();
    _("#date").innerHTML = time;
}, 1000)

_("#btn-change-currency").addEventListener("click", ()=>{
	const selected = document.querySelectorAll("select");
	let fromCurrency = selected[0].options[selected[0].selectedIndex];
	let toCurrency = selected[1].options[selected[1].selectedIndex];
	[toCurrency.text, fromCurrency.text] = [fromCurrency.text, toCurrency.text];
})

_("#btn-convert").addEventListener("click", ()=>{
	const selected = document.querySelectorAll("select");
	let fromCurrency = selected[0].options[selected[0].selectedIndex].text;
	let toCurrency = selected[1].options[selected[1].selectedIndex].text;
	fromCurrency = fromCurrency.split("-");
	toCurrency = toCurrency.split("-");

	let amount = Number(_("#amount").value);
	_("#conversion-info").innerHTML = "";
	_("#btn-convert").style.opacity = "0.1";
	_("#further-info-heading").textContent = `Conversion from ${fromCurrency[1].trim()} to ${toCurrency[1].trim()}`
	if(amount > 0)
	{
		getOtherInfoAPI(fromCurrency[0].trim(),toCurrency[0].trim(),amount);
	}
})

