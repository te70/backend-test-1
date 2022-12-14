import { Request, Response } from 'express';
import AttemptLogin from '../../application/use_cases/auth/AttemptLogin';
import GetAccessToken from '../../application/use_cases/auth/GetAccessToken';

export default {

  async login(request: Request, response: Response) {
    // Context
    const serviceLocator = request.serviceLocator!;

    // Input
    const {
      email,
      password
    } = request.body;

    // Treatment
    let user = null;
    try {
      user = await AttemptLogin(email, password, serviceLocator);
      user.accessToken = await GetAccessToken(user, serviceLocator);
    } catch (err) {
      console.log(err);
    }

    // Output
    if (!user) {
      return response.status(401).json({ 'message': 'Bad credentials' });
    }
    const output = serviceLocator.userSerializer.serialize(user, serviceLocator);
    return response.json(output);
  },

};
