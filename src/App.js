import { useState } from 'react';
import { Offline, Online } from "react-detect-offline";
import './App.css';

const initForm = {
	binCode: '',
	skuCode: '',
	scanItem: '',
};

function App() {
	const [tableNo, setTableNo] = useState(localStorage.getItem('tableNo') || '');
	const [formData, setFormData] = useState(initForm);

	const handleTableNumberSet = (e) => {
		localStorage.setItem('tableNo', e.target.value);
		setTableNo(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log({ tableNo, ...formData });
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tableNo, ...formData })
    })
	};

	const handleChange = (key, val) => {
		setFormData((state) => {
			return { ...state, [key]: val };
		});
	};

	return (
		<div className='App'>
			<Online>
				<form onSubmit={handleSubmit}>
					<label>
						Table No.
						<input
							required
							type='text'
							value={tableNo}
							onChange={handleTableNumberSet}
						/>
					</label>
					<div className='main-form-data'>
						<label>
							Bin Code
							<input
								required
								type='text'
								value={formData.binCode}
								onChange={(e) => handleChange('binCode', e.target.value)}
							/>
						</label>
						<label>
							SKU Code
							<input
								required
								type='text'
								value={formData.skuCode}
								onChange={(e) => handleChange('skuCode', e.target.value)}
							/>
						</label>
					</div>

					<label>
						Scan Item
						<input
							required
							type='text'
							value={formData.scanItem}
							onChange={(e) => handleChange('scanItem', e.target.value)}
						/>
					</label>

					<input type='submit' value='Enter' />
				</form>
				<div className='item-data-container'>
					<div>Scanned Items: 05</div>
					<div>Printed Items: 04</div>
					<div>Error Items: 01</div>
				</div>
			</Online>
			<Offline>
				<span className='offline'>
					You're offline right now. Check your connection.
				</span>
			</Offline>
		</div>
	);
}

export default App;
