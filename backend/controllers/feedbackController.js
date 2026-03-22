const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const feedback = new Feedback({
      event: req.params.eventId,
      user: req.user.id,
      rating,
      comment
    });
    await feedback.save();

    // Update Event average rating
    const event = await Event.findById(req.params.eventId);
    const totalScore = (event.averageRating * event.totalRatings) + rating;
    event.totalRatings += 1;
    event.averageRating = totalScore / event.totalRatings;
    await event.save();

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
