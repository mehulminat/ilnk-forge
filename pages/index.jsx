import React, { useEffect, useState, Component, useRef } from 'react';
import styles from '../styles/pages/LandingPage.module.css';
import {useRouter} from 'next/router';
import svg from '../src/helper/svg';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setPageHeading } from '../src/redux/actions/commonAction';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper";
import 'swiper/css';
import "swiper/css/pagination";

import Cookies from 'js-cookie';

import Typewriter from 'typewriter-effect/dist/core';
import Head from 'next/head';
import { common } from '../src/helper/Common';


const Home = () => {
  

  const router = useRouter();
  const headerContainer = useRef();
  const headerNav = useRef();

  const [isUserLogin, setIsUserLogin] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false)

  let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            title: "LinkForge - The Ultimate Bio Link Manager",
            keywords : "linkforge, linkforge.com, link url, biolink, bio link, miniwebsite, mini website, social link, personal link, portfolio link, bio link generator",
            description: "The Ultimate Bio Link Manager. Organize your social handles into a single tap. Get a link and work smart.",
            pageHeading: "LinkForge - The Ultimate Bio Link Manager",
        }));
  }, [router]);

  useEffect(() => {
    let tokenCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : false;
    if(tokenCookie){
      setIsUserLogin(true);
    }else{
      setIsUserLogin(false);
    }


    new Typewriter('#type_anim', {
      // strings: ['Social Link', 'Bio Link', 'Portfolio', 'Mini Website'],

      strings: ['Mini Website', 'Bio Link', 'Portfolio Site', 'Social Link' , 'Personal URL', 'Link  URL', 'Pro Bio URL'],
      autoStart: true,
      loop: true
    });

  },[router.query]);

  const [landTemp,setLandTemp] = useState([
      {id:1,img:'./images/html_template_preview/theme1.jpg'},
      {id:2,img:'./images/html_template_preview/theme2.jpg'},
      {id:3,img:'./images/html_template_preview/theme3.jpg'},
      {id:4,img:'./images/html_template_preview/theme4.jpg'},
      {id:5,img:'./images/html_template_preview/theme5.jpg'},
      {id:6,img:'./images/html_template_preview/theme6.jpg'},
      {id:7,img:'./images/html_template_preview/theme7.jpg'},
      {id:8,img:'./images/html_template_preview/theme8.jpg'},
      {id:9,img:'./images/html_template_preview/theme9.jpg'},
      {id:10,img:'./images/html_template_preview/theme10.jpg'},
      {id:11,img:'./images/html_template_preview/theme11.jpg'},
      {id:12,img:'./images/html_template_preview/theme12.jpg'},
      {id:13,img:'./images/html_template_preview/theme13.jpg'},
      {id:14,img:'./images/html_template_preview/theme14.jpg'},
      {id:15,img:'./images/html_template_preview/theme15.jpg'},
      {id:16,img:'./images/html_template_preview/theme16.jpg'},
      {id:17,img:'./images/html_template_preview/theme17.jpg'},
      {id:18,img:'./images/html_template_preview/theme18.jpg'},
      {id:19,img:'./images/html_template_preview/theme19.jpg'},
      {id:20,img:'./images/html_template_preview/theme20.jpg'},
    ]
  );

  const [testimonial,setTestimonial] = useState([
      {
        id:1,
        img:'./images/landing/client01.png',
        name : 'Richard Butler',
        title : 'UI/UX Designer',
        description : 'Etiam venenatis ultricies elit, nec posuere leo tempus nec. Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. Praesent porttitor erat tellus, eu iaculis dolor venenatis ut. Nulla ullamcorper mattis egestas. Vestibulum vulputate pulvinar mi vitae placerat.'
      },
      {
        id:2,
        img:'./images/landing/client02.png',
        name : 'Richard Butler',
        title : 'UI/UX Designer',
        description : 'Etiam venenatis ultricies elit, nec posuere leo tempus nec. Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit'
      },
      {
        id:3,
        img:'./images/landing/client03.png',
        name : 'Richard Butler',
        title : 'UI/UX Designer',
        description : 'Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. Praesent porttitor erat tellus, eu iaculis dolor venenatis ut.'
      },
      {
        id:4,
        img:'./images/landing/client04.png',
        name : 'Richard Butler',
        title : 'UI/UX Designer',
        description : 'Etiam venenatis ultricies elit, nec posuere leo tempus nec. Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. '
      },
      {
        id:5,
        img:'./images/landing/client05.png',
        name : 'Richard Butler',
        title : 'UI/UX Designer',
        description : ' eu iaculis dolor venenatis ut. Nulla ullamcorper mattis egestas. Vestibulum vulputate pulvinar mi vitae placerat.'
      },
      {
        id:6,
        img:'./images/landing/client06.png',
        name : 'Richard Butler',
        title : 'UI/UX Designer',
        description : 'Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. Praesent porttitor erat tellus, eu iaculis dolor venenatis ut. Nulla ullamcorper mattis egestas. Vestibulum vulputate pulvinar mi vitae placerat.'
      }
    ]
  );

    const [activeTest, setActiveTest] = useState('');


  /* useEffect(() => {
    router.push('/auth/login');
  }) */

  /* menu toggle outside click start */
  useEffect(() => {
    function handleClickOutside(event) {
        if (headerNav.current && !headerNav.current.contains(event.target)) {
            headerContainer.current.classList.remove(styles.openNav);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerNav]);
  /* menu toggle outside click end */
  const navToggle = () => {
      headerContainer.current.classList.add(styles.openNav);
  }

  const checkPlanFeature = () =>{
    common.getAPI(
        {
            method: "POST",
            url: 'auth/checkPlanFeature',
            data: {}
        },
        (resp) => {
            if(resp.status === 'success'){
                setIsEnabled(resp.data.isEnabled);
            }
        }
    );
  }

  useEffect(() => {
    setActiveTest(testimonial[0]);
    checkPlanFeature();
  }, []);
  
  const activeTestimonialHandle = (tesy) => {
    setActiveTest(tesy);
  }

  const scrollToSection = (id) => {
    var el = document.getElementById(id);
    el.scrollIntoView();
  }

  return (
    <>
      <Head>
        <title>LinkForge - The Ultimate Bio Link Manager</title>
      </Head>
      <div className={styles.wrapper}>
        {/* header start */}
        <div className={styles.header}>
          <div className="pu_container" ref={headerContainer}>
            <div className={styles.header_inner}>
              <div className={styles.logo}>
                <Link href="/"><a>
                  {/* {svg.logo} */}
                  <img src="/images/fl.png" alt="" />
                  </a></Link>
              </div>
              <div className={styles.nav_toggle} onClick={() => navToggle()}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.833403 8.33236C0.612371 8.33236 0.400392 8.24456 0.244098 8.08826C0.0878049 7.93197 0 7.71999 0 7.49896V0.833403C0 0.612371 0.0878049 0.400392 0.244098 0.244098C0.400392 0.0878048 0.612371 0 0.833403 0H7.50063C7.72166 0 7.93364 0.0878048 8.08993 0.244098C8.24622 0.400392 8.33403 0.612371 8.33403 0.833403V7.49896C8.33403 7.71999 8.24622 7.93197 8.08993 8.08826C7.93364 8.24456 7.72166 8.33236 7.50063 8.33236H0.833403ZM12.501 8.33236C12.28 8.33236 12.068 8.24456 11.9117 8.08826C11.7554 7.93197 11.6676 7.71999 11.6676 7.49896V0.833403C11.6676 0.612371 11.7554 0.400392 11.9117 0.244098C12.068 0.0878048 12.28 0 12.501 0H19.1666C19.3876 0 19.5996 0.0878048 19.7559 0.244098C19.9122 0.400392 20 0.612371 20 0.833403V7.49896C20 7.71999 19.9122 7.93197 19.7559 8.08826C19.5996 8.24456 19.3876 8.33236 19.1666 8.33236H12.501ZM0.833403 20C0.612371 20 0.400392 19.9122 0.244098 19.7559C0.0878049 19.5996 0 19.3876 0 19.1666V12.4994C0 12.2783 0.0878049 12.0664 0.244098 11.9101C0.400392 11.7538 0.612371 11.666 0.833403 11.666H7.50063C7.72166 11.666 7.93364 11.7538 8.08993 11.9101C8.24622 12.0664 8.33403 12.2783 8.33403 12.4994V19.1666C8.33403 19.3876 8.24622 19.5996 8.08993 19.7559C7.93364 19.9122 7.72166 20 7.50063 20H0.833403ZM12.501 20C12.28 20 12.068 19.9122 11.9117 19.7559C11.7554 19.5996 11.6676 19.3876 11.6676 19.1666V12.4994C11.6676 12.2783 11.7554 12.0664 11.9117 11.9101C12.068 11.7538 12.28 11.666 12.501 11.666H19.1666C19.3876 11.666 19.5996 11.7538 19.7559 11.9101C19.9122 12.0664 20 12.2783 20 12.4994V19.1666C20 19.3876 19.9122 19.5996 19.7559 19.7559C19.5996 19.9122 19.3876 20 19.1666 20H12.501Z" fill="#F9913A"/></svg>
                  <span>Menu</span>
              </div>
              <div className={styles.nav} ref={headerNav}>
                <ul>
                  <li><a onClick={() => scrollToSection("stab_home")}>Home</a></li>
                  <li><a onClick={() => scrollToSection("stab_template")}>Templates</a></li>
                  <li><a onClick={() => scrollToSection("stab_howitwork")}>How It Works</a></li>
                  <li><a onClick={() => scrollToSection("stab_features")}>Features</a></li>
                  
                </ul>
              </div>
              <div className={styles.header_action}>
                {isUserLogin ? 
                    <Link href="/dashboard"><a className="pu_btn">Dashboard</a></Link>
                    : 
                    <>
                      <Link href="/auth/login"><a className={"pu_btn pu_btn_link " + styles.pu_btn_link}>Sign In</a></Link>
                      <Link href="/auth/registration"><a className="pu_btn">Sign Up</a></Link>
                    </>
                }
              </div>
              <div className={'pu_dropdown_wrapper ' + styles.header_action_mobile}>
                <div className={'pu_dropdown_toggle ' + styles.header_action_avatar} data-toggle="dropdown">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6.42847C13.9404 6.42847 12.9047 6.74266 12.0237 7.33131C11.1427 7.91996 10.4561 8.75663 10.0506 9.73552C9.64514 10.7144 9.53905 11.7916 9.74576 12.8307C9.95247 13.8699 10.4627 14.8245 11.2119 15.5737C11.9611 16.3229 12.9157 16.8331 13.9548 17.0398C14.994 17.2465 16.0712 17.1404 17.0501 16.735C18.0289 16.3295 18.8656 15.6429 19.4543 14.7619C20.0429 13.8809 20.3571 12.8452 20.3571 11.7856C20.3571 10.3648 19.7927 9.0022 18.788 7.99754C17.7834 6.99288 16.4208 6.42847 15 6.42847ZM15 14.9999C14.3642 14.9999 13.7428 14.8114 13.2142 14.4582C12.6856 14.105 12.2736 13.603 12.0304 13.0157C11.7871 12.4283 11.7234 11.782 11.8474 11.1585C11.9715 10.535 12.2776 9.96229 12.7271 9.51277C13.1766 9.06324 13.7494 8.75711 14.3729 8.63308C14.9964 8.50906 15.6427 8.57271 16.23 8.816C16.8174 9.05928 17.3194 9.47126 17.6725 9.99985C18.0257 10.5284 18.2143 11.1499 18.2143 11.7856C18.2134 12.6378 17.8745 13.4549 17.2719 14.0575C16.6693 14.6601 15.8522 14.999 15 14.9999Z" fill="#F9913A"/><path d="M15 0C12.0333 0 9.13319 0.879735 6.66645 2.52796C4.19971 4.17618 2.27713 6.51886 1.14181 9.25975C0.00649925 12.0006 -0.290551 15.0166 0.288227 17.9263C0.867006 20.8361 2.29562 23.5088 4.3934 25.6066C6.49119 27.7044 9.16394 29.133 12.0736 29.7118C14.9834 30.2905 17.9994 29.9935 20.7403 28.8582C23.4811 27.7229 25.8238 25.8003 27.472 23.3335C29.1203 20.8668 30 17.9667 30 15C29.9955 11.0231 28.4137 7.21047 25.6016 4.39841C22.7895 1.58635 18.9769 0.0045372 15 0V0ZM8.57143 26.1182V24.6429C8.57228 23.7906 8.9112 22.9736 9.51382 22.3709C10.1164 21.7683 10.9335 21.4294 11.7857 21.4286H18.2143C19.0665 21.4294 19.8836 21.7683 20.4862 22.3709C21.0888 22.9736 21.4277 23.7906 21.4286 24.6429V26.1182C19.4777 27.2574 17.2591 27.8577 15 27.8577C12.7409 27.8577 10.5223 27.2574 8.57143 26.1182V26.1182ZM23.5629 24.5636C23.5415 23.1582 22.9689 21.8175 21.9685 20.8303C20.968 19.843 19.6198 19.2884 18.2143 19.2857H11.7857C10.3802 19.2884 9.03197 19.843 8.03153 20.8303C7.03108 21.8175 6.4585 23.1582 6.43715 24.5636C4.49418 22.8287 3.124 20.5445 2.50804 18.0136C1.89208 15.4826 2.0594 12.8243 2.98783 10.3906C3.91627 7.95683 5.56203 5.8625 7.70719 4.38489C9.85235 2.90728 12.3957 2.1161 15.0005 2.1161C17.6054 2.1161 20.1487 2.90728 22.2939 4.38489C24.4391 5.8625 26.0848 7.95683 27.0132 10.3906C27.9417 12.8243 28.109 15.4826 27.493 18.0136C26.8771 20.5445 25.5069 22.8287 23.5639 24.5636H23.5629Z" fill="#F9913A"/></svg>
                </div>
                <div className={'pu_dropdown_dd ' + styles.profile_dropdown}>
                    <ul>
                        <li><Link href="/auth/login"><a className="pu_dropdown_link">Sign In</a></Link></li>
                        <li><Link href="/auth/registration"><a className="pu_dropdown_link">Sign Up</a></Link></li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* header end */}
        
        {/* banner start */}
        <div className={styles.banner} id="stab_home" style={{backgroundImage : "url('./images/landing/banner.jpg')"}}>
          <div className={styles.bg_left} style={{backgroundImage : "url('./images/landing/bg_left.png')"}}>
          </div>
          <div className="pu_container banner__full">
            <div className={styles.banner_content}>
              <div className={styles.banner_left}>
                <h1>Create Your Own
                  <span id="type_anim"></span>
                  in Just a Single Tap.</h1>  
                <p>The Ultimate Bio Link Manager</p>
                <Link href="/auth/login"><a className="pu_btn">Get Started {svg.btn_arrow_right}</a></Link>
              </div>
              <div className={styles.banner_right} >
                  <div className={styles.banner_img} >
                    <img className={styles.options_mainimg} src="./images/landing/mobile.png" alt="banner" />
                        <img className={`${styles.bg_options} ${styles.bg_options1}`} src="./images/landing/options.png" alt="banner" />            
                    </div>
                </div>
            </div>
          </div>
        </div>
        {/* banner end */}

        
        {/* core_feature start */}
        <div className={styles.core_feature}>
          <div className="pu_container">
            <div className={styles.core_feature_content}>
              <div className={styles.core_feature_left}>
                <div className={styles.core_feature_box}>
                  <img src="./images/landing/Fe-01.png" alt="feature" />
                  <h3>Dynamic Insight</h3>
                  <p>Experience the vast access to various platforms fosters an enormous engagement.</p>
                  <Link href="/"><a className="">{svg.landing_angle}</a></Link>
                </div>
                <div className={styles.core_feature_box}>
                  <img src="./images/landing/Fe-02.png" alt="feature" />
                  <h3>Efficient approach</h3>
                  <p>Create a single link and save a bunch of hours for you and your subscribers.</p> 
                  <Link href="/"><a className="">{svg.landing_angle}</a></Link>
                </div>
              </div>
              <div className={styles.core_feature_right}>
                <div className={styles.main_heading}>
                  <h3>Our core features</h3>
                </div>
                <p>LinkForge provides a single location to concentrate your follower’s attention on your every social media account. Also, you can customize your profile with the available creative templates. Here you can edit the content and add the links to your website or social media handles. It helps you keep in touch with your followers/subscribers for longer.</p>
                <Link href="/auth/login"><a className="pu_btn">Know More</a></Link>
              </div>
            </div>
          </div>
        </div>
        {/* core_feature end */}

        {/* templates start */}
        <div className={styles.templates} id="stab_template" style={{backgroundImage : "url('./images/landing/template-bg.jpg')"}}>
          <div className="pu_landing_templates">
            <div className={styles.main_heading}>
              <h3>Start With Creative Templates</h3>
              <strong>Get started with LinkForge to play around with these stunning templates.</strong>
            </div>
            <div className="pu_templates_slider">
              <Swiper
                spaceBetween={0}
                slidesPerView={'auto'}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                centeredSlides={true}
                modules={[Autoplay]}

              >
                {landTemp.map((ltemp,index)=>
                  <SwiperSlide key={index}>
                    <img src={ltemp.img} width="100%" alt="templates"/>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
            {/* <div className="text-center"><br/><br/>
              <Link href="/auth/login"><a className="pu_btn">Get Started {svg.btn_arrow_right}</a></Link>
            </div> */}
          </div>
        </div>
        {/* templates end */}
        {/* works start */}
        <div className={styles.works} id="stab_howitwork">
          <div className="pu_container">
            <div className={styles.main_heading}>
              <h3>How it Works</h3>
              <strong>Get one link to make your followers step into your digital province.</strong>
            </div>
            <div className={styles.works_content}>
              <div className={styles.works_left}>
                <div className={styles.works_box}>
                  <div className={styles.works_box_icon}>
                    {svg.landing_temp_icon}
                  </div>
                  <div className={styles.works_box_data}>
                    <h3>Select a Template</h3>
                    <p>Choose a template from the available 10+ designs, we provide.</p>
                  </div>
                </div>
                <div className={styles.works_box}>
                  <div className={styles.works_box_icon}>
                    {svg.landing_edit_icon}
                  </div>
                  <div className={styles.works_box_data}>
                    <h3>Edit template</h3>
                    <p>Customize the template with added text and add links.</p>
                  </div>
                </div>
                <div className={styles.works_box}>
                  <div className={styles.works_box_icon}>
                    {svg.landing_share_icon}
                  </div>
                  <div className={styles.works_box_data}>
                    <h3>Copy & Share </h3>
                    <p>Tadda!!!!! You are ready to share the single link with your visitors and get more engagement. </p>
                  </div>
                </div>
              </div>
              <div className={styles.works_right} >
                <div className={styles.works_video}>
                    <div className={styles.video_container}>
                      
                        <iframe width="560" height="315" src="" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* works end */}

        {/* testimonial start */}
        <div className={styles.testimonial} style={{backgroundImage : "url('./images/landing/banner_bg.jpg')", display : "none"}}>
          <div className="pu_container">
            <div className={styles.main_heading}>
              <h3>What Our Users Say</h3>
              <strong>Pellentesque sem nunc, consequat non ullamcorper eu</strong>
            </div>
          <div className={styles.testimonial_main} style={{backgroundImage : "url('./images/landing/shapesbg.png')"}}>
            <div className={styles.testimonial_list_main}>
              <ul>
                {testimonial.map(item =>
                  <li key={item.id} onClick={() => activeTestimonialHandle(item)} className={(item.id === activeTest.id ? styles.active : '')}><img src={item.img} alt=""/></li>
                )}
              </ul>
              <div className={styles.testimonial_box_contant}>
                  <div className={styles.testimonial__box}>
                      <span className={styles.icon_testimonial}> <img src="./images/landing/Shapetestimonial.png" alt="testimonial" /></span>
                      <p className={styles.content_box_tes}>{activeTest.description}</p>
                        <img src={activeTest.img} alt="" />
                        <h3 className={styles.client_name}>{activeTest.name}</h3>
                        <p className={styles.client_info}>{activeTest.title}</p>
                  </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        {/* testimonial end */}

        {/* exclusive features section start */}

        <div className={styles.exclusive_features_wr} id="stab_features" style={{backgroundImage : "url('./images/landing/features-bg.jpg')"}}>
          <div className="pu_container">
            <div className={styles.main_heading}>
              <h3>Features</h3>
              {/* <strong>Pellentesque sem nunc, consequat non ullamcorper eu</strong> */}
            </div>
            <div className={styles.exclusive_features_main}>
              
                <div className={styles.features_box}>
                    <div className={styles.features_box_item}>
                      <img src="./images/landing/features_2.png" alt="icons" />
                      <h3>Multiple links</h3>
                      <p>Generate as many links you wish to share with your preferred audience.</p>
                    </div>
                </div>
                <div className={styles.features_box}>
                  <div className={styles.features_box_item}>
                      <img src="./images/landing/features_3.png" alt="icons" />
                      <h3>App Synchronization</h3>
                      <p>Share your favorite music, podcasts, videos, and saved pins.</p>
                    </div>
                </div>
                
                
                <div className={styles.features_box}>
                  <div className={styles.features_box_item}>
                      <img src="./images/landing/features_6.png" alt="icons" />
                      <h3>Share your Ideas with the world</h3>
                      <p>A single link can take people to your ideas on different pages.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* exclusive features section end */}
        {/* footer section start */} 
          <div className={styles.footer__wr}>
            <div className="pu_container">
            <div className={styles.footer_main_box}>
              <div className={`${styles.footer_item} ${styles.footer_list_1}`}>
                  <div className={styles.logo_footer}>
                    {/* {svg.logo} */}
                    <img src="/images/fl.png" alt="" />
                  </div>
                  {/* <p>LinkForge allows you to create a custom, personalized page that stores all the prominent links you wish to share with your viewers.</p> */}
              </div>
              <div className={`${styles.footer_item} ${styles.footer_list_2}`}>
                  {/* <div className={styles.footer_icon}> */}
                  {/* <img src='./images/landing/Shape 603.png' alt='shape'/> */}
                  {/* </div> */}
                  <div className={styles.footer_info}>
                   
                    <p>LinkForge allows you to create a custom, personalized page that stores all the prominent links you wish to share with your viewers.</p>

                  </div>
                
              </div>
              {/* <div className={`${styles.footer_item} ${styles.footer_list_3}`}>
              <div className={styles.footer_icon}>
                  <img src='./images/landing/Shape 600.png' alt='shape'/>
                  </div>
                  <div className={styles.footer_info}>
                    <h3>Contact No.</h3>
                    <p>+91 123 456 789</p>
                  </div>

              </div> */}
              {/* <div className={`${styles.footer_item} ${styles.footer_list_4}`}>
              <div className={styles.footer_icon}>
                  <img src='./images/landing/Shape 602.png' alt='shape'/>
                  </div>
                  <div className={styles.footer_info}>
                    <h3>Whatsapp Chat</h3>
                    <p><span>Click Here to Chat</span></p>
                  </div>
              </div> */}
            </div>
            
            </div>

            <div className={styles.footer_copy__right}>
              <p>Copyright © 2025 LinkForge. All rights reserved. </p>
            </div>
          </div>
      
        {/* footer section end */} 

        
      </div>
    </>
  );
}

export default Home;
