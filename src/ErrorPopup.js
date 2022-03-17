const ErrorPopup = ({errorMsg, setErrorMsg}) => {
	return (
		<div id='myModal' className='modal'>
			<div className='modal-content'>
				<span className='close' onClick={() => setErrorMsg('')}>&times;</span>
                <h2>Error!!</h2>
				<p>{errorMsg}</p>
			</div>
		</div>
	);
};

export default ErrorPopup;
