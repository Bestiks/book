// Burger Menu Initialization
function initBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    // Проверяем наличие элементов
    if (!burgerMenu || !mobileNav || !overlay) {
        console.warn('Элементы бургер-меню не найдены');
        return;
    }

    // Сбрасываем начальное состояние
    burgerMenu.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = '';

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    // Удаляем существующие обработчики событий
    burgerMenu.removeEventListener('click', toggleMenu);
    overlay.removeEventListener('click', toggleMenu);

    // Добавляем обработчики событий
    burgerMenu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Закрытие меню при клике на ссылку
    const mobileLinks = mobileNav.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.removeEventListener('click', toggleMenu);
        link.addEventListener('click', toggleMenu);
    });

    // Закрытие меню при изменении размера экрана
    function handleResize() {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    }

    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
}

// Инициализируем бургер-меню сразу после загрузки DOM
document.addEventListener('DOMContentLoaded', initBurgerMenu);

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const bookCards = document.querySelectorAll('.book-card');
    const booksGrid = document.querySelector('.books-grid');

    if (!filterButtons.length || !bookCards.length || !booksGrid) {
        console.warn('Элементы фильтрации не найдены');
        return;
    }

    // Показать все книги при загрузке
    bookCards.forEach(card => {
        card.style.display = 'block';
    });

    // Обработчик клика по кнопкам фильтрации
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-filter');

            // Фильтруем книги
            bookCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || selectedCategory === cardCategory) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // Обработчики для кнопок "Читать подробнее"
    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const bookCard = button.closest('.book-card');
            const title = bookCard.querySelector('h3').textContent;
            const author = bookCard.querySelector('.author').textContent;
            const description = bookCard.querySelector('.description').textContent;
            const image = bookCard.querySelector('img').src;

            showBookModal({
                title,
                author,
                description,
                image
            });
        });
    });
});

// Interactive Book Logic
let currentPage = 1;
const totalPages = 3;
const book = document.querySelector('.realistic-book');
const pages = document.querySelectorAll('.book-page');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const currentPageDisplay = document.querySelector('.current-page');

function updatePageButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    currentPageDisplay.textContent = currentPage;
}

async function goToPage(newPage) {
    if (newPage === currentPage) return;
    
    const direction = newPage > currentPage ? 'forward' : 'backward';
    
    if (direction === 'forward') {
        const currentPageElement = pages[currentPage - 1];
        const nextPageElement = pages[newPage - 1];
        
        await turnPage(currentPageElement);
        nextPageElement.style.visibility = 'visible';
    } else {
        const previousPage = pages[currentPage - 2];
        const currentPageElement = pages[currentPage - 1];
        
        unturnPage(previousPage);
        currentPageElement.style.visibility = 'hidden';
    }
    
    currentPage = newPage;
    updatePageButtons();
}

function turnPage(pageElement) {
    return new Promise(resolve => {
        pageElement.classList.add('turning');
        
        pageElement.addEventListener('animationend', function handler() {
            pageElement.classList.remove('turning');
            pageElement.classList.add('turned');
            pageElement.removeEventListener('animationend', handler);
            resolve();
        });
    });
}

function unturnPage(pageElement) {
    pageElement.classList.remove('turned', 'turning');
}

// Инициализация начального состояния
function initializeBook() {
    pages.forEach((page, index) => {
        if (index === 0) {
            page.style.visibility = 'visible';
        } else {
            page.style.visibility = 'hidden';
        }
    });
    updatePageButtons();
}

// Вызываем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', initializeBook);

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
});

// Добавляем обработку клавиш для навигации
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' && currentPage > 1) {
        e.preventDefault();
        goToPage(currentPage - 1);
    } else if (e.code === 'ArrowRight' && currentPage < totalPages) {
        e.preventDefault();
        goToPage(currentPage + 1);
    }
});

// Smooth Scrolling for Navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const element = document.querySelector(this.getAttribute('href'));
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Collection Categories Data
const categoryBooks = {
    fantasy: [
        {
            title: 'Хроники Драконов',
            author: 'Елена Соколова',
            description: 'Эпическая сага о мире, где драконы и люди живут бок о бок.',
            image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=500&auto=format'
        },
        {
            title: 'Магическая Академия',
            author: 'Дмитрий Волков',
            description: 'История юной волшебницы, постигающей тайны магии.',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format'
        },
        {
            title: 'Лесное Королевство',
            author: 'Анна Морозова',
            description: 'Волшебная история о древних лесных духах и их хранителях.',
            image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format'
        }
    ],
    scifi: [
        {
            title: 'Колония Марса',
            author: 'Игорь Звездин',
            description: 'Научно-фантастический роман о первых поселенцах на Марсе.',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format'
        },
        {
            title: 'Нейросеть',
            author: 'Мария Технова',
            description: 'История о мире, где искусственный интеллект обрел сознание.',
            image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&auto=format'
        },
        {
            title: 'Квантовый Прыжок',
            author: 'Павел Будущев',
            description: 'Захватывающий роман о путешествиях между параллельными мирами.',
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format'
        }
    ],
    mystery: [
        {
            title: 'Тайна Старого Дома',
            author: 'Сергей Детективов',
            description: 'Увлекательный детектив о загадочных происшествиях в старинном особняке.',
            image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=500&auto=format'
        },
        {
            title: 'Код Черного Ворона',
            author: 'Ирина Загадкина',
            description: 'Детективная история о поиске древнего артефакта.',
            image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&auto=format'
        },
        {
            title: 'Последнее Дело',
            author: 'Алексей Шерлоков',
            description: 'Захватывающий детектив о последнем расследовании знаменитого сыщика.',
            image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&auto=format'
        }
    ]
};

// Modal Logic
const modal = document.getElementById('category-modal');
const modalTitle = document.getElementById('modal-title');
const modalBooks = document.getElementById('modal-books');
const closeModal = document.querySelector('.close-modal');

// Collection Items Click Handlers
document.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const category = item.dataset.category;
        const categoryTitle = item.querySelector('h3').textContent;
        showCategoryBooks(category, categoryTitle);
    });
});

function showCategoryBooks(category, categoryTitle) {
    modalTitle.textContent = categoryTitle;
    modalBooks.innerHTML = '';
    
    categoryBooks[category].forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'modal-book';
        bookElement.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="modal-book-info">
                <h3>${book.title}</h3>
                <p><strong>Автор:</strong> ${book.author}</p>
                <p>${book.description}</p>
            </div>
        `;
        modalBooks.appendChild(bookElement);
    });
    
    modal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Dynamic Book Hover Effect
document.querySelectorAll('.book').forEach(book => {
    book.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = book.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const rotateX = (y - 0.5) * 20;
        const rotateY = (x - 0.5) * 20;
        
        book.querySelector('.book-cover').style.transform = 
            `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    book.addEventListener('mouseleave', () => {
        book.querySelector('.book-cover').style.transform = 
            'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Navigation Background Change on Scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

function showBookModal(bookInfo) {
    const modal = document.createElement('div');
    modal.className = 'book-modal';
    modal.innerHTML = `
        <div class="book-modal-content">
            <span class="close-modal">&times;</span>
            <div class="book-modal-grid">
                <div class="book-modal-image">
                    <img src="${bookInfo.image}" alt="${bookInfo.title}">
                </div>
                <div class="book-modal-info">
                    <h2>${bookInfo.title}</h2>
                    <p class="author">${bookInfo.author}</p>
                    <p class="description">${bookInfo.description}</p>
                    <button class="read-book-btn">Читать книгу</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}