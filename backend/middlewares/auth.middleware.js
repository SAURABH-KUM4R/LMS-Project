import jwt from 'jsonwebtoken'
import AppError from '../utils/error.utils.js';

const isLoggedin = async (req,res,next) => {
    const { token } = req.cookies;
    if(!token) {
        return next(new AppError('Unauthenticated, please login again', 400))
    }

    const userDetails = await jwt.verify(token,process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

const authRoles = (...roles) => async (req,res,next) => {
    const currentRoles = req.user.role;
    if (!roles.includes(currentRoles)) {
        return next(
            new AppError('You do not have permission to access this area',403)
        )
    }
    next();
}

const authSubscriber = async (req,res,next) => {
    const subscription = req.user.subscription;
    const currentRole = req.user.role;
    if (currentRole !== 'ADMIN' && subscription.status !== 'active') {
        return next(
            new AppError('Please subscribe to access this route', 403)
        )
    }

    next();
}
export {
    isLoggedin,
    authRoles,
    authSubscriber
}