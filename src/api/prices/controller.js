import { fetchSampleData } from './service';

export default (req, res, next) => {
  try {
    const data = fetchSampleData();
    res.jsend.success(data);
  } catch (error) {
    next(error);
  }
};
