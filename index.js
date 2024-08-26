// JavaScript 动画

export default {
	visible,
	classes,
	toggle,
	scroll,
	texts,
	trip,
	hide,
	show
}

/**
 * 当前页面是否可见，如果浏览器最小化则不可见
 */
function visible() {
	if (document.hidden) {
		return false;
	}
	if (document.visibilityState === "visible") {
		return true;
	}
}
/**
 * 监听页面可见事件，如果页面隐藏停止所有动画
 */
document.addEventListener("visibilitychange", function(sender, event) {

});

// window.requestAnimationFrame(function(timestamp){});
// 执行频率默认为每秒60次，约16.67ms每帧

/**
 * 数字跳跃，从当前值跳跃到目标值
 * @param {Element} element 显示数值的标签
 * @param {Number} target 目标数值
 */
function trip(element, target) {
	if (element && element.trim) {
		element = document.getElementById(element);
	}
	if (element) {
		if (target) {
			if (visible()) {
				let temp, time = 0,
					source = Number(element.innerText);
				const frame = function(timestamp) {
					if (source !== target) {
						if (source > target) {
							temp = source - target;
							source -= temp > 1000 ? 1000 : temp > 100 ? 100 : temp > 10 ? 10 : 1;
							temp = (target / source) * 20;
						} else {
							temp = target - source;
							source += temp > 1000 ? 1000 : temp > 100 ? 100 : temp > 10 ? 10 : 1;
							temp = (source / target) * 20;
						}
						if (time == 0 || timestamp - time >= temp) {
							element.innerText = source;
							time = timestamp;
						}
						window.requestAnimationFrame(frame);
					} else {
						element.innerText = source;
					}
				};
				frame(0);
			} else {
				element.innerText = target;
			}
		} else {
			element.innerText = "";
		}
	}
}

/**
 * 自动滚动
 * @param {Element} container 容器标签,其下得子元素将滚动
 * @param {Number} speed 滚动速度,0将取消滚动
 * @param {Number} delay 切换滚动方向时的延迟
 */
function scroll(container, speed = 20, delay = 100) {
	if (container && container.trim) {
		container = document.getElementById(container);
	}
	if (container) {
		let animate = container.__A_SCROLL;
		if (animate) {
			// 已绑定动画
			// 如果多次绑定会创建多个定时器导致画面跳动
			if (speed && delay) {
				animate.speed = speed;
				animate.delay = delay;
			} else {
				container.__A_SCROLL = null;
				container.style.scrollbarWidth = null;
				animate.eventController.abort();
				animate.state = false;
				animate.speed = 0;
				animate.delay = 0;
			}
		} else
		if (speed && delay) {
			// 隐藏滚动条但可以滚动
			container.style.scrollbarWidth = "none";
			container.__A_SCROLL = animate = {
				eventController: new AbortController(),
				speed: speed,
				delay: delay,
				state: true
			};
			// 鼠标移入暂停滚动
			container.addEventListener("mouseenter", function() {
				animate.state = false;
			}, {
				signal: animate.eventController.signal
			})
			// 鼠标移出继续滚动
			container.addEventListener("mouseleave", function() {
				animate.state = true;
			}, {
				signal: animate.eventController.signal
			});

			// 动画函数
			let time = 0,
				direction = 1;
			let top = container.scrollTop;
			const frame = function(timestamp) {
				if (time == 0 || timestamp - time >= animate.speed) {
					time = timestamp;

					if (animate.state) {
						top += direction;
						container.scrollTop = top;
						// delay 用于切换延迟
						if (top + animate.delay < 0 || top - animate.delay >= container.scrollHeight - container.clientHeight) {
							direction = direction * -1;
						}
					}
				}
				if (animate.speed && animate.delay) {
					window.requestAnimationFrame(frame);
				}
			}
			frame(0);
		}
	}
}

/**
 * 文本切换，可用于字体图标切换实现动画
 * @param {Element} element 显示文本的标签
 * @param {String[]} texts 文本数组,空对象将取消动画
 * @param {Number} delay 切换延迟,0将取消动画
 */
function texts(element, texts, delay = 300) {
	if (element && element.trim) {
		element = document.getElementById(element);
	}
	if (element) {
		let animate = element.__A_TEXTS;
		if (animate) {
			// 已绑定动画
			// 如果多次绑定会创建多个定时器导致画面跳动
			if (texts && delay) {
				animate.delay = delay;
				animate.texts = texts;
			} else {
				element.__A_TEXTS = null;
				animate.delay = 0;
			}
		} else
		if (texts && delay) {
			element.__A_TEXTS = animate = {
				delay: delay,
				texts: texts
			};
			// 动画函数
			let time = 0,
				index = 0;
			const frame = function(timestamp) {
				if (time == 0 || timestamp - time >= animate.delay) {
					time = timestamp;

					if (index < animate.texts.length) {
						element.innerText = animate.texts[index++];
					} else {
						index = 1;
						element.innerText = animate.texts[0];
					}
				}
				if (animate.texts && animate.delay) {
					window.requestAnimationFrame(frame);
				}
			}
			frame(0);
		}
	}
}

/**
 * 样式切换，可用于字体图标切换实现动画
 * @param {Element} element 应用样式的标签
 * @param {String[]} classes 样式数组,空对象将取消动画
 * @param {Number} delay 切换延迟,0将取消动画
 */
function classes(element, classes, delay = 300) {
	if (element && element.trim) {
		element = document.getElementById(element);
	}
	if (element) {
		let animate = element.__A_CLASSES;
		if (animate) {
			// 已绑定动画
			// 如果多次绑定会创建多个定时器导致画面跳动
			if (classes && delay) {
				animate.classes = classes;
				animate.delay = delay;
			} else {
				element.__A_CLASSES = null;
				animate.delay = 0;
			}
		} else
		if (classes && delay) {
			element.__A_CLASSES = animate = {
				classes: classes,
				delay: delay
			};
			// 动画函数
			let time = 0,
				index = 0;
			const frame = function(timestamp) {
				if (time == 0 || timestamp - time >= animate.delay) {
					time = timestamp;

					element.classList.remove(...animate.classes);
					if (index < animate.classes.length) {
						element.classList.add(animate.classes[index++]);
					} else {
						element.classList.add(animate.classes[0]);
						index = 1;
					}
				}
				if (animate.classes && animate.delay) {
					window.requestAnimationFrame(frame);
				}
			}
			frame(0);
		}
	}
}

/**
 * 切换显示，切换显示容器内的子元素，将根据容器高度自动适配可视元素
 * @param {Element} container 容器标签,其下得子元素将切换
 * @param {Number} units 每次切换子元素数量,0将取消动画
 * @param {Number} delay 切换延迟,0将取消动画
 */
function toggle(container, units = 1, delay = 3000) {
	if (container && container.trim) {
		container = document.getElementById(container);
	}
	if (container) {
		let animate = container.__A_TOGGLE;
		if (animate) {
			// 已绑定动画，如果多次绑定会创建多个定时器导致画面跳动
			if (units && delay) {
				animate.units = units;
				animate.delay = delay;
			} else {
				container.__A_TOGGLE = null;
				container.style.scrollbarWidth = null;
				animate.eventController.abort();
				// 将已隐藏的项目全部显示
				for (let index = 0; index < container.children.length; index++) {
					show(container.children.item(index));
				}
			}
		} else
		if (units && delay) {
			// 隐藏滚动条但可以滚动
			container.style.scrollbarWidth = "none";
			container.__A_TOGGLE = animate = {
				eventController: new AbortController(),
				units: units,
				delay: delay,
				shows: [],
				state: true
			};
			// 鼠标移入暂停切换
			container.addEventListener("mouseenter", function() {
				animate.state = false;
			}, {
				signal: animate.eventController.signal
			})
			// 鼠标移出继续切换
			container.addEventListener("mouseleave", function() {
				animate.state = true;
			}, {
				signal: animate.eventController.signal
			});

			// 初始显示
			let size = 0;
			let height = 0;
			let element, index = 0;
			const elements = [];
			for (; index < container.children.length; index++) {
				element = container.children.item(index);
				elements.push(element);
				height += element.offsetHeight;
				if (height > container.clientHeight) {
					hide(element);
				} else {
					size++;
				}
			}
			if (size >= elements.length) {
				// 已经容纳全部项目，无须滚动
				return;
			}

			// 动画函数
			let time = 0;
			const frame = function(timestamp) {
				if (timestamp > 0 && timestamp - time >= animate.delay) {
					time = timestamp;
					if (animate.state) {
						size = 0;
						// 隐藏队列头部的部分标签
						for (index = 0; index < animate.units && index < elements.length; index++) {
							element = elements.shift();
							elements.push(element);
							hide(element, true);
							size++;
						}
						//跳过头部已显示标签
						for (index = 0; index < elements.length; index++) {
							element = elements[index];
							if (element.hidden) {
								break;
							}
						}
						// 显示后部分与隐藏数量相同的标签
						for (; size > 0 && index < elements.length; index++, size--) {
							element = elements[index];
							show(element, true);
						}
					}
				}
				if (animate.units && animate.delay) {
					window.requestAnimationFrame(frame);
				}
			}
			frame(0);
		}
	}
}

const hides = [];
const shows = [];

function hide(element, h = false, w = false) {
	if (element) {
		if (element.trim) {
			element = document.getElementById(element);
		}
		if (element) {
			if (element.hidden || element.__A_VISIBLE) {
				// 已隐藏或正在隐藏
				return;
			}

			const styles = window.getComputedStyle(element);
			element.__A_VISIBLE = {
				element: element,
				style: element.style.cssText,
				width: parseFloat(styles.width),
				height: parseFloat(styles.height),
				paddingTop: parseFloat(styles.paddingTop),
				paddingLeft: parseFloat(styles.paddingLeft),
				paddingRight: parseFloat(styles.paddingRight),
				paddingBottom: parseFloat(styles.paddingBottom)
			};
			element.style.overflow = "hidden";
			if (w) {
				// 记录当前宽度相关值
				element.__A_VISIBLE.w = element.__A_VISIBLE.width;
				element.__A_VISIBLE.pl = element.__A_VISIBLE.paddingLeft;
				element.__A_VISIBLE.pr = element.__A_VISIBLE.paddingRight;
			}
			if (h) {
				// 记录当前高度相关值
				element.__A_VISIBLE.h = element.__A_VISIBLE.height;
				element.__A_VISIBLE.pt = element.__A_VISIBLE.paddingTop;
				element.__A_VISIBLE.pb = element.__A_VISIBLE.paddingBottom;
			}
			// console.log(element.__A_VISIBLE);
			if (w || h) {
				hides.push(element.__A_VISIBLE);
				if (hides.length == 1) {
					hideFrame(0);
				}
			} else {
				element.hidden = true;
			}
		}
	}
}

function hideFrame(timestamp) {
	if (hides.length) {
		let animate, s;
		for (let index = 0; index < hides.length; index++) {
			animate = hides[index];
			s = 0;
			// WIDTH
			if (animate.pl > 1) {
				animate.pl -= animate.pl * 0.15;
				animate.element.style.paddingLeft = animate.pl + "px";
				s++;
			}
			if (animate.pr > 1) {
				animate.pr -= animate.pr * 0.15;
				animate.element.style.paddingRight = animate.pr + "px";
				s++;
			}
			if (animate.w > 1) {
				animate.w -= animate.w * 0.15;
				animate.element.style.width = animate.w + "px";
				s++;
			}
			// HEIGHT
			if (animate.pt > 1) {
				animate.pt -= animate.pt * 0.15;
				animate.element.style.paddingTop = animate.pt + "px";
				s++;
			}
			if (animate.pb > 1) {
				animate.pb -= animate.pb * 0.15;
				animate.element.style.paddingBottom = animate.pb + "px";
				s++;
			}
			if (animate.h > 1) {
				animate.h -= animate.h * 0.15;
				animate.element.style.height = animate.h + "px";
				s++;
			}
			if (s <= 0) {
				animate.element.hidden = true;
				hides.splice(index--, 1);
			}
		}
	}
	if (hides.length) {
		window.requestAnimationFrame(hideFrame);
	}
}

function show(element, h = false, w = false) {
	if (element) {
		if (element.trim) {
			element = document.getElementById(element);
		}
		if (element) {
			if (element.hidden && element.__A_VISIBLE) {
				if (w) {
					// 记录当前宽度相关值
					element.__A_VISIBLE.w = 0;
					element.__A_VISIBLE.pl = 0;
					element.__A_VISIBLE.pr = 0;

					element.style.width = "0px";
					element.style.paddingLeft = "0px";
					element.style.paddingRight = "0px";
				} else {
					element.__A_VISIBLE.w = element.__A_VISIBLE.width;
					element.__A_VISIBLE.pl = element.__A_VISIBLE.paddingLeft;
					element.__A_VISIBLE.pr = element.__A_VISIBLE.paddingRight;

					element.style.width = element.__A_VISIBLE.width + "px";
					element.style.paddingLeft = element.__A_VISIBLE.paddingLeft + "px";
					element.style.paddingRight = element.__A_VISIBLE.paddingRight + "px";
				}
				if (h) {
					// 记录当前高度相关值
					element.__A_VISIBLE.h = 0;
					element.__A_VISIBLE.pt = 0;
					element.__A_VISIBLE.pb = 0;

					element.style.height = "0px";
					element.style.paddingTop = "0px";
					element.style.paddingBottom = "0px";
				} else {
					element.__A_VISIBLE.h = element.__A_VISIBLE.height;
					element.__A_VISIBLE.pt = element.__A_VISIBLE.paddingTop;
					element.__A_VISIBLE.pb = element.__A_VISIBLE.paddingBottom;

					element.style.height = element.__A_VISIBLE.height + "px";
					element.style.paddingTop = element.__A_VISIBLE.paddingTop + "px";
					element.style.paddingBottom = element.__A_VISIBLE.paddingBottom + "px";
				}
				element.hidden = false;
				if (w || h) {
					shows.push(element.__A_VISIBLE);
					if (shows.length == 1) {
						showFrame(0);
					}
				} else {
					element.style.cssText = element.__A_VISIBLE.style;
					element.__A_VISIBLE = null;
				}
			} else {
				element.__A_VISIBLE = null;
				element.hidden = false;
			}
		}
	}
}

function showFrame(timestamp) {
	if (shows.length) {
		let animate, s;
		for (let index = 0; index < shows.length; index++) {
			animate = shows[index];
			s = 0;
			// WIDTH
			if (animate.paddingLeft - animate.pl > 1) {
				animate.pl += (animate.paddingLeft - animate.pl) * 0.15;
				animate.element.style.paddingLeft = animate.pl + "px";
				s++;
			}
			if (animate.paddingRight - animate.pr > 1) {
				animate.pr += (animate.paddingRight - animate.pr) * 0.15;
				animate.element.style.paddingRight = animate.pr + "px";
				s++;
			}
			if (animate.width - animate.w > 1) {
				animate.w += (animate.width - animate.w) * 0.15;
				animate.element.style.width = animate.w + "px";
				s++;
			}
			// HEIGHT
			if (animate.paddingTop - animate.pt > 1) {
				animate.pt += (animate.paddingTop - animate.pt) * 0.15;
				animate.element.style.paddingTop = animate.pt + "px";
				s++;
			}
			if (animate.paddingBottom - animate.pb > 1) {
				animate.pb += (animate.paddingBottom - animate.pb) * 0.15;
				animate.element.style.paddingBottom = animate.pb + "px";
				s++;
			}
			if (animate.height - animate.h > 1) {
				animate.h += (animate.height - animate.h) * 0.15;
				animate.element.style.height = animate.h + "px";
				s++;
			}
			if (s <= 0) {
				animate.element.style.cssText = animate.element.__A_VISIBLE.style;
				animate.element.__A_VISIBLE = null;
				shows.splice(index--, 1);
			}
		}
	}
	if (shows.length) {
		window.requestAnimationFrame(showFrame);
	}
}

// console.log("JOYZL")