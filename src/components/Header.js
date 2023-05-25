import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import logo from '../img/header-logo.png';
import {
	headerHiddenPanelBasketVisibility,
	headerHiddenPanelProfileVisibility,
	headerMainSearchVisibility
} from "../utils/functions";
import Cart from'./Cart';
import DroppedMenu from './DroppedMenu';

const history = createBrowserHistory({
  forceRefresh: true
});

const LinkItem = props => {
	return(
			<li
					onClick={props.onClick || (() => null)}
					className={props.liClassName}
			>
				<Link to={props.to}>{props.title}</Link>
			</li>
	)
};

const LinkItemDiv = props => {
	return(
			<li
					onClick={props.onClick || (() => null)}
					className={props.liClassName}
			>
				<a>{props.title}</a>
			</li>
	)
};


const topMenuItems = [
	{
		title: 'Возврат',
		link: '/'
	},
	{
		title: 'Доставка и оплата',
		link: '/'
	},
	{
		title: 'О магазине',
		link: '/'
	},
	{
		title: 'Контакты',
		link: '/'
	},
	{
		title: 'Новости',
		link: '/'
	}
];

 
export default class Header extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.state = {
            searchValue: '',
            amount: undefined,
            activeCategory: undefined,
            categoryID: undefined
        };        
    }

 	mainSubmenuVisibility(event) {
    const target = event.currentTarget;
    if (target.className.split(' ')[target.className.split(' ').length-1] === ('main-menu__item_active')) {
        document.querySelector('.dropped-menu').classList.remove('dropped-menu_visible')
        target.classList.remove('main-menu__item_active');
    } else {
        if (document.querySelector('.main-menu__item_active')) {
            document.querySelector('.main-menu__item_active').classList.toggle('main-menu__item_active');
        }
        document.querySelector('.dropped-menu').classList.add('dropped-menu_visible');
        target.classList.toggle('main-menu__item_active');
    }

}

 searchSubmit = (event) => {
    event.preventDefault();
    history.push(`/products?search=${this.state.searchValue}`);
    this.setState({ searchValue: '' });
  }

 changeSearchValue = (event) => {
    this.setState({ searchValue: event.currentTarget.value });

  }

	componentDidUpdate(prevProps) {
    	if(!this.props.cart.length) return; 
    		if((this.props.cart.length !== prevProps.cart.length)) {

    			this.counterFlashing();
    		}
	}

	counterFlashing = (cart) => {
			function func() {
				if(document.querySelector('.header-main__pic_basket_full'))
					document.querySelector('.header-main__pic_basket_full').classList.toggle('hidden')
			}
			var setInt = setInterval(func, 500);
			setTimeout(function() {
			  clearInterval(setInt);
			}, 5000)
			document.querySelector('.header-main__pic_basket_full').classList.remove('hidden')
				
	}

	getActiveCategoryId = (categoryId) => {
		this.setState({
			activeCategory: categoryId
		})
	}

	render() {
		
		const {fetching, categories, handleUpdateCart, cart, amount} = this.props;
		return (
				<header className="header">
					<div className="top-menu">
						<div className="wrapper">
							<ul className="top-menu__items">
								{
									topMenuItems.map((item, index) =>
											<LinkItem
													key={item.id || index}
													liClassName="top-menu__item"
													to="/"
													title={item.title}
											/>
									)
								}
							</ul>
						</div>
					</div>

					<div className="header-main">
						<div className="header-main__wrapper wrapper">
							<div className="header-main__phone">
								<a href="tel:+7-495-790-35-03">+7 495 79 03 5 03</a>
								<p>Ежедневно: с 09-00 до 21-00</p>
							</div>
							<div className="header-main__logo">
								<Link to="/">
									<h1>
										<img src={logo} alt="logotype"/>
									</h1>
								</Link>
								<p>Обувь и аксессуары для всей семьи</p>
							</div>
							<div className="header-main__profile">
								<div className="header-main__pics">
									<div
											onClick={headerMainSearchVisibility}
											className="header-main__pic header-main__pic_search"
									/>
									<div className="header-main__pic_border"/>
									<div
											onClick={headerHiddenPanelProfileVisibility}
											className="header-main__pic header-main__pic_profile"
									>
										<div className="header-main__pic_profile_menu"/>
									</div>
									<div className="header-main__pic_border"/>
									<div
											onClick={headerHiddenPanelBasketVisibility}
											className="header-main__pic header-main__pic_basket"
									>
										{
											cart.length ?
												<div className="header-main__pic_basket_full">{amount}</div>:
												null
										}
										<div className="header-main__pic_basket_menu"/>

									</div>
								</div>
								<form onSubmit={this.searchSubmit} className="header-main__search" action="#">
              						<input onChange={this.changeSearchValue} value={this.state.searchValue} placeholder="Поиск" />
              						<i className="fa fa-search" aria-hidden="true"></i>
            					</form>
								
							</div>

						</div>
						<div className="header-main__hidden-panel hidden-panel">
							<div className="hidden-panel__profile">
								<a href="/">Личный кабинет</a>
								<Link to="/favorites">
									<i className="fa fa-heart-o" aria-hidden="true"/>
									Избранное
								</Link>
								<a href="/">Выйти</a>
							</div>
							<Cart cart={cart} handleUpdateCart={handleUpdateCart}/>
						</div>
					</div>

					<nav className="main-menu">
						<div className="wrapper">
							{
								!fetching && categories.length ?
										<ul className="main-menu__items">
											{
												categories.map(category =>
														<LinkItemDiv
																key={category.id}
																liClassName="main-menu__item"
																
																title={category.title}
																onClick={(event) =>
																	{
																		this.mainSubmenuVisibility(event);
																		this.getActiveCategoryId(category.id)
																		
																	}
																}
																
														/>
												)
											}
										</ul> :
										undefined
							}
						</div>
					</nav>
					<DroppedMenu  activeCategory={this.state.activeCategory} mainSubmenuVisibility={this.mainSubmenuVisibility}/>
				</header>
		);
	}
}

Header.propTypes = {
	fetching: PropTypes.bool,
	categories: PropTypes.array.isRequired,
	cart: PropTypes.array.isRequired,
	handleUpdateCart: PropTypes.func.isRequired
};

Header.contextTypes = {
	api: PropTypes.string.isRequired
};