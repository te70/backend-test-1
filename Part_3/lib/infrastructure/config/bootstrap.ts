require('dotenv').config();

import constants from './constants';
import environment from './environment';

export default {

  async init() {
    if (environment.database.dialect === constants.SUPPORTED_DATABASE.MONGO) {
      require('../orm/mongoose/mongoose');
    }
  }
};
