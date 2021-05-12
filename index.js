// const fs = require('fs');
// const util = require('util');

const axios = require('axios');
const mailer = require('nodemailer');
const moment = require('moment');
// const handlebars = require('handlebars');
//
// let compiledTemplate = null;

// (async function() {
//   try {
//     readFile = util.promisify(fs.readFile);
//     const template = await readFile('./template.hbs', 'utf8');
//     compiledTemplate = handlebars.compile(template);
//     // console.log(template);
//   } catch (error) {
//     console.error(error);
//   }
// }());

const getCalendarByDistrict = async (districtId, date) => {
  try {
    // Call CoWIN calendarByDistrict API
    const calendarByDistrict = await axios.get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`,
        {
          headers: {
            'user-agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
          },
        },
    );
    // console.log(JSON.stringify(calendarByDistrict.data));
    return calendarByDistrict.data.centers;
  } catch (error) {
    console.error(error);
  }
};

const parseData = (data) => {
  const resultArray = [];
  data.forEach((center) => {
    center.sessions.forEach((session) => {
      if (
        // session.available_capacity > 0 &&
        session.min_age_limit === 18 &&
        (resultArray.find((c) =>
          (c.center_id === center.center_id)) === undefined)) {
        resultArray.push({
          center_id: center.center_id,
          name: center.name,
          address: center.address,
          sessions: JSON.stringify(center.sessions),
          from: center.from,
          to: center.to,
        });
      }
    });
  });
  return resultArray;
};

const sendMail = (data) => {};

(async function() {
  const date = moment().format('DD-MM-YYYY');
  const data = await getCalendarByDistrict(363, date);
  const parsedData = parseData(data);

  // const content = compiledTemplate({'centers': parsedData});
  console.log(parsedData);
})();
