/*
 * -------------------------------------------------------
 * File : doubt.controller.js
 * Description : Handles doubt creation, AI answers, and
 *               "students stuck on this topic" matching
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const doubtModel = require("../model/doubt.model");
const { generateDoubtAnswer } = require("../service/ai.service");

/*
 * Ask a new doubt — gets AI answer + checks for
 * other students stuck on the same topic recently
 */
async function askDoubt(req, res) {
  try {
    const { subject, topic, question } = req.body;

    if (!subject || !topic || !question) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const answer = await generateDoubtAnswer({ subject, topic, question });

    const doubt = await doubtModel.create({
      user: req.user._id,
      subject,
      topic,
      question,
      answer,
    });

    // Find other students who asked about the same topic in the last 30 mins
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

    const peersOnSameTopic = await doubtModel
      .find({
        subject,
        topic,
        user: { $ne: req.user._id },
        createdAt: { $gte: thirtyMinsAgo },
      })
      .distinct("user");

    return res.status(201).json({
      doubt,
      peersStuckOnTopic: peersOnSameTopic.length,
    });
  } catch (error) {
    console.error("Ask Doubt Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
 * Get logged-in student's doubt history
 */
async function getMyDoubts(req, res) {
  try {
    const doubts = await doubtModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ doubts });
  } catch (error) {
    console.error("Get My Doubts Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
 * Get subject-wise doubt count — powers the
 * progress tracker dashboard
 */
async function getProgressStats(req, res) {
  try {
    const stats = await doubtModel.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({ stats });
  } catch (error) {
    console.error("Get Progress Stats Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { askDoubt, getMyDoubts, getProgressStats };