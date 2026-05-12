import axios from 'axios';

const evaluationService = async (req, res, next) => {
  const data = req.body;
  try {
    const response = await axios.post(process.env.EVALUATION_URL + '/valuate', data);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default evaluationService;
