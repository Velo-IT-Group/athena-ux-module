import { Twilio } from 'twilio';

const client = new Twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, {
	accountSid: process.env.TWILIO_ACCOUNT_SID,
});

const deleteWorker = (req, res) => {};

const createWorker = (req, res) => {};

const listWorker = (req, res) => {};
