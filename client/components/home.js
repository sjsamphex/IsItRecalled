import React from 'react';
import { connect } from 'react-redux';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import { setBarcode } from '../store/product';
import ProductInfo from './ProductInfo';
import RecallInfo from './RecallInfo';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import PageviewIcon from '@material-ui/icons/Pageview';

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { email } = props.state.auth;
  const [data, setData] = React.useState('Not Found');
  const [dataset, setDataSet] = React.useState([]);
  const [scan, setScan] = React.useState(false);
  async function onUpdate(err, result) {
    if (result) {
      setData(result.text);

      setDataSet((dataset) => {
        if (!dataset.includes(result.text)) {
          dataset.push(result.text);
        }
        return dataset;
      });
    }
  }
  const product = props.state.product;
  if (product.bcData.fdaData) {
    // console.log(product.bcData.fdaData.results[0]);
  }
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  };
  return (
    <Container>
      <h2>Welcome, {email}</h2>
      <h3>You may need to accept camera permissions :)</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setScan(!scan)}
      >
        Toggle the Scanner!
      </Button>
      <Container style={styles.container}>
        {scan && (
          <BarcodeScannerComponent
            width={'50%'}
            onUpdate={(err, result) => {
              onUpdate(err, result);
            }}
          />
        )}
        <div>
          {!isNaN(parseInt(data)) && (
            <Button
              endIcon={<PageviewIcon />}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setScan(false);
                props.setBarcode(data);
              }}
            >
              {data}
            </Button>
          )}
        </div>
      </Container>
      <p>Barcodes scanned so far:</p>
      <ul>
        {dataset.map((dat) => (
          <li key={dat}>
            <Button
              endIcon={<PageviewIcon />}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setScan(false);
                props.setBarcode(dat);
              }}
            >
              {dat}
            </Button>
          </li>
        ))}
      </ul>
      {props.state.product.bcData.barcodeData && <ProductInfo />}

      <br />
      {props.state.product.bcData.fdaData ? (
        <RecallInfo />
      ) : (
        'no recalls found yet'
      )}

      <div className="staging">
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => onUpdate('', { text: '0853584002201' })}
        >
          Staging: Fake Barcode if Camera fails
        </Button>
      </div>
    </Container>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    state,
  };
};

const mapDispatch = (dispatch) => {
  return {
    setBarcode: (bc) => dispatch(setBarcode(bc)),
  };
};

export default connect(mapState, mapDispatch)(Home);
