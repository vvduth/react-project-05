import React, { useEffect, useState, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT'){
    return {value: action.val, isValid : action.val.includes('@')};
  }
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value , isValid:state.value.includes('@')};
  }
  return {value: '',  isValid: false}
};

const passwordReducer = (state, action) => {
  if (action.type === 'PASSWORD_INPUT'){
    return {value: action.val, isValid: action.val.trim().length > 6};
  }
  if (action.type === 'PASSWORD_BLUR'){
    return {value: state.value, isValid : state.value.trim().length > 6}
  }
  return {value: '',  isValid: false}

}
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  }) ;

  const [passwordState, dispatchPassword] = useReducer(passwordReducer,{
    value: '',
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef() ;

  const {isValid: emailIsValid } = emailState; //prevent from re run the effect when props change to many times
  const {isValid: passwordIsValid} = passwordState ;
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('checking ...')
      setFormIsValid(
        emailState.isValid && passwordState.isValid
      );
    }, 500);
    return () => { // this function wil run before above function
      console.log('clean');
      clearTimeout(identifier);
    };
  },[emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});
    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid 
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'PASSWORD_INPUT', val: event.target.value});
    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'PASSWORD_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid){
      authCtx.onLogIn(emailState.value, passwordState.value);
    } else if (!emailIsValid){
      emailInputRef.current.activate() ;
    } else {

    }
    
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input id = "email" 
               ref = {emailInputRef}
               label = "E-mail" 
               type = "email" 
               isValid = {emailIsValid} 
               value = {emailState.value}
               onChange = {emailChangeHandler}
               onBlur = {validateEmailHandler} />
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

// const { someProperty } = someObject;
// useEffect(() => {
//   // code that only uses someProperty ...
// }, [someProperty]);


// useEffect(() => {
//   // code that only uses someProperty ...
// }, [someObject.someProperty]);

// ===> can you either of above blocks of code

//AVOID THIS

// useEffect(() => {
//   // code that only uses someProperty ...
// }, [someObject]);
// Why?

// Because now the effect function would re-run whenever 
// ANY property of someObject changes - not just the one 
// property (someProperty in the above example) 
// our effect might depend on.