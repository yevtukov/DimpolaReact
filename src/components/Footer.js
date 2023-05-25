import React from 'react';

export default class Footer extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            isHidden:true
        };
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
    }

    handleClickSubmit(evt) {
        evt.preventDefault();
        const field = evt.target.parentElement.email;
        const reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (field.value.match(reg)) {
            this.setState({
                isValid: true
            })
        } else {
            this.setState({
                isHidden:false
            })
        }
    }
	render() {
		return (
				<footer className="footer">
					<section className="subscribe">
						<div className="subscribe__wrapper">
							<h2 className="subscribe__title">подписаться на рассылку выгодных предложений</h2>
							{this.state.isValid
								? <span>Подписка оформлена! Спасибо!</span>
								: <form className="subscribe__radios" action="">
								<label className="subscribe__radio_label">
									<input className="subscribe__radio" type="radio" name="subscribe" value="women"/>
									<div className="subscribe__radio_text">Женское</div>
								</label>
								<label className="subscribe__radio_label">
									<input className="subscribe__radio" type="radio" name="subscribe" value="men"/>
									<div className="subscribe__radio_text">Мужское</div>
								</label>
								<label className="subscribe__radio_label">
									<input className="subscribe__radio" type="radio" name="subscribe" value="both" defaultChecked/>
									<div className="subscribe__radio_text">Всё</div>
								</label>
								<input className="subscribe__email" type="email" placeholder="Ваш e-mail" name='email'/>
								<input className="subscribe__submit" type="submit" value="ПОДПИСАТЬСЯ" 
								onClick={this.handleClickSubmit}/>
								{this.state.isHidden
	                                ? null
	                                : <span className='incorrect-email'>Неверно введён email</span>


                            	}
							</form>

							}
							
						</div>
					</section>
					<div className="footer__bottom">
						<div className="wrapper">
							<div className="footer__menus">
								<div className="footer__menu footer__menu_about">О магазине
									<ul>
										<li><a href="/">BosaNoga</a></li>
										<li><a href="/">Новости</a></li>
										<li><a href="/">Пресса</a></li>
									</ul>
								</div>
								<div className="footer__menu footer__menu_collection">Коллекции
									<ul>
										<li><a href="/">Обувь</a></li>
										<li><a href="/">Аксессуары</a></li>
										<li><a href="/">Для дома</a></li>
									</ul>
								</div>
								<div className="footer__menu footer__menu_help">Помощь
									<ul>
										<li><a href="/">Как купить?</a></li>
										<li><a href="/">Возврат</a></li>
										<li><a href="/">Контакты</a></li>
									</ul>
								</div>
							</div>
							<div className="footer__info">
								<h3 className="footer__info_title">Принимаем к оплате:</h3>
								<div className="footer__paid-systems">
									<div className="footer__paid footer__paid_paypal"/>
									<div className="footer__paid footer__paid_master-card"/>
									<div className="footer__paid footer__paid_visa"/>
									<div className="footer__paid footer__paid_yandex"/>
									<div className="footer__paid footer__paid_webmoney"/>
									<div className="footer__paid footer__paid_qiwi"/>
								</div>
								<div className="footer__social-links">
									<h3 className="footer__social-links_title">Мы в соц.сетях:</h3>
									<div className="footer__social-link footer__social-link_twitter"/>
									<div className="footer__social-link footer__social-link_vk"/>
								</div>
								<div className="footer__copyright">2009-2018 © BosaNoga.ru — модный интернет-магазин обуви<br/> и
									аксессуаров. Все права защищены. Доставка по всей России!
								</div>
							</div>
							<div className="footer__contacts">
								<a
										className="footer__phone"
										href="tel:+7-495-790-35-03"
								>+7 495 79 03 5 03</a>
								<p className="footer__phone_text">Ежедневно: с 09-00 до 21-00</p>
								<a
										className="footer__email"
										href="mailto:office@bosanoga.ru"
								>office@bosanoga.ru</a>
							</div>
						</div>
					</div>
				</footer>
		)
	}
}