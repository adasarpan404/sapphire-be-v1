const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const globalErrorHandler = require('./Service/ErrorController')
const AppError = require('./Utils/AppError')
const collectionRouter = require('./Router/collectionRouter')
const userRouter = require('./Router/userRouter')
const TradeRouter = require('./Router/TradeRouter')
const FavouritesRouter = require('./Router/FavouritesRouter')
const purchaseRouter = require('./Router/PurchaseRouter')
const AuctionRouter = require('./Router/AuctionRouter')

const app = express();
app.enable('trust proxy');
app.use(cors());
app.options('*', cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// app.use('/api/v1/sample', sampleRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/collection', collectionRouter);
app.use('/api/v1/trade', TradeRouter);
app.use('/api/v1/favourites',FavouritesRouter );
app.use('/api/v1/purchase', purchaseRouter);
app.use('/api/v1/auction', AuctionRouter)
app.use(globalErrorHandler);

module.exports = app;