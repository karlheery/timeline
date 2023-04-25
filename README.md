This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Recompile SCCS using

  sass ScrapbookStyle.scss scrapbook-style.css

I build and ship it serverless using:

	npm run build; aws s3 sync build/ s3://<bucket-name>

Migration script from old photoshow to this timeline app

  aws s3 cp s3://<photos>/media/Christmas s3://<public>/Christmas --include "Christmas" --recursive --no-paginate

Useful links:
- https://web.dev/responsive-web-design-basics/#media-queries
- https://www.w3schools.com/cssref/css_units.asp
- https://reactjsexample.com/otp-input-component-for-react/
- https://github.com/react-grid-layout/react-grid-layout/blob/master/test/examples/9-min-max-wh.jsx



