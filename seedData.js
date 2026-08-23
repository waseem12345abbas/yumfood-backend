require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('./config/db');
const Category = require('./models/Category');
const Post = require('./models/Post');
const User = require('./models/User');

const categoriesData = [
  {
    name: 'Food',
    slug: 'food',
    description: 'Discover delicious recipes, food trends, cooking tips and culinary stories.',
    icon: '🍔',
    color: '#FF6B35',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    name: 'Tech',
    slug: 'tech',
    description: 'Latest technology news, gadgets, software, programming and innovation.',
    icon: '💻',
    color: '#2563EB',
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Business insights, entrepreneurship, startups, finance and leadership.',
    icon: '💼',
    color: '#059669',
    gradient: 'from-emerald-400 to-green-600',
  },
  {
    name: 'Crypto',
    slug: 'crypto',
    description: 'Cryptocurrency, blockchain, Web3, digital assets and decentralized technology.',
    icon: '₿',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'AI',
    slug: 'ai',
    description: 'Artificial intelligence, machine learning, generative AI and automation.',
    icon: '🤖',
    color: '#7C3AED',
    gradient: 'from-purple-400 to-violet-600',
  },
];

const postsData = [
  // =========================================================
  // FOOD - 10 POSTS
  // =========================================================

  {
    title: '10 Easy Breakfast Ideas for Busy Mornings',
    excerpt:
      'Start your day with simple and nutritious breakfast ideas that can be prepared in minutes.',
    content: `
      <h2>Simple Breakfasts for Busy Days</h2>
      <p>Breakfast does not have to take a lot of time. With a few simple ingredients, you can prepare a satisfying meal before starting your day.</p>
      <p>Egg sandwiches, overnight oats, fruit bowls and yogurt parfaits are excellent choices when you are short on time.</p>
      <h3>Prepare Ahead</h3>
      <p>Preparing ingredients the night before can save valuable time in the morning. Overnight oats and pre-cut fruit are particularly convenient.</p>
      <p>A balanced breakfast should include protein, carbohydrates and healthy fats to help keep you energized throughout the morning.</p>
    `,
    tags: ['breakfast', 'food', 'recipes', 'healthy'],
  },

  {
    title: 'How to Make the Perfect Homemade Pizza',
    excerpt:
      'Learn the essential techniques for making crispy, flavorful homemade pizza from scratch.',
    content: `
      <h2>The Secret to Great Homemade Pizza</h2>
      <p>Making pizza at home is easier than many people think. The most important part is preparing a good dough and allowing enough time for it to rise.</p>
      <p>Use high-quality flour, fresh yeast and a little olive oil to create a flavorful base.</p>
      <h3>Choose Your Toppings</h3>
      <p>Keep toppings balanced rather than adding too many ingredients. Fresh vegetables, mozzarella and herbs can create a delicious combination.</p>
      <p>A very hot oven helps create a crispy crust while keeping the center soft and flavorful.</p>
    `,
    tags: ['pizza', 'recipe', 'cooking', 'food'],
  },

  {
    title: 'The Rise of Healthy Eating in Modern Life',
    excerpt:
      'Healthy eating is becoming an important part of modern lifestyles as people pay more attention to nutrition.',
    content: `
      <h2>A New Approach to Food</h2>
      <p>People around the world are becoming more interested in healthy eating and balanced lifestyles.</p>
      <p>Instead of following extreme diets, many people are focusing on whole foods, fresh vegetables, fruits, proteins and balanced portions.</p>
      <h3>Small Changes Matter</h3>
      <p>Healthy eating does not require completely changing your lifestyle overnight. Small improvements can have a meaningful impact over time.</p>
      <p>Drinking more water, eating more vegetables and reducing highly processed foods are simple places to start.</p>
    `,
    tags: ['healthy eating', 'nutrition', 'lifestyle', 'food'],
  },

  {
    title: 'Five Popular Street Foods You Should Try',
    excerpt:
      'Explore some of the most popular and flavorful street foods enjoyed around the world.',
    content: `
      <h2>Street Food Around the World</h2>
      <p>Street food offers an affordable and exciting way to experience local culture.</p>
      <p>From spicy noodles and tacos to grilled meats and stuffed breads, every region has its own unique specialties.</p>
      <h3>Why Street Food Is Special</h3>
      <p>Street food is often prepared using traditional recipes that have been passed between generations.</p>
      <p>Trying local food can be one of the best ways to understand a new culture.</p>
    `,
    tags: ['street food', 'travel', 'food', 'culture'],
  },

  {
    title: 'Essential Cooking Tips Every Beginner Should Know',
    excerpt:
      'These practical cooking tips will help beginners become more confident in the kitchen.',
    content: `
      <h2>Become More Comfortable in the Kitchen</h2>
      <p>Cooking becomes easier when you understand a few basic principles.</p>
      <p>Always prepare your ingredients before starting. This technique, known as mise en place, makes cooking more organized.</p>
      <h3>Learn Basic Techniques</h3>
      <p>Start by learning how to properly chop vegetables, control heat and season food gradually.</p>
      <p>As your confidence grows, you can experiment with different flavors and cooking methods.</p>
    `,
    tags: ['cooking tips', 'beginner', 'kitchen', 'food'],
  },

  {
    title: 'Why Fresh Ingredients Make a Difference',
    excerpt:
      'Fresh ingredients can improve the flavor, texture and nutritional value of everyday meals.',
    content: `
      <h2>The Value of Fresh Ingredients</h2>
      <p>Fresh ingredients can make a noticeable difference in the quality of a meal.</p>
      <p>Fresh vegetables often have better texture and stronger natural flavors than ingredients that have been stored for long periods.</p>
      <h3>Shop Seasonally</h3>
      <p>Buying seasonal produce can provide better flavor while also supporting local farmers and reducing food transportation.</p>
    `,
    tags: ['fresh food', 'ingredients', 'cooking', 'nutrition'],
  },

  {
    title: 'A Beginner Guide to Baking at Home',
    excerpt:
      'Discover the basic ingredients, tools and techniques needed to start baking at home.',
    content: `
      <h2>Starting Your Baking Journey</h2>
      <p>Baking can be both relaxing and rewarding. Beginners can start with simple recipes such as cookies, muffins and basic cakes.</p>
      <p>Accurate measurements are particularly important when baking because ingredients interact through precise chemical processes.</p>
      <h3>Follow the Recipe</h3>
      <p>Read the complete recipe before starting and prepare all ingredients in advance.</p>
      <p>With practice, you will become comfortable adjusting recipes and creating your own variations.</p>
    `,
    tags: ['baking', 'desserts', 'recipes', 'food'],
  },

  {
    title: 'How Spices Can Transform Everyday Meals',
    excerpt:
      'Learn how different spices can add depth, aroma and character to simple meals.',
    content: `
      <h2>The Power of Spices</h2>
      <p>Spices can completely change the character of a dish without requiring expensive ingredients.</p>
      <p>Cumin, paprika, turmeric, black pepper and cinnamon each bring unique aromas and flavors.</p>
      <h3>Experiment Carefully</h3>
      <p>When trying a new spice, start with a small amount and gradually increase it.</p>
      <p>Understanding how spices work together can help you create more interesting meals.</p>
    `,
    tags: ['spices', 'cooking', 'flavor', 'food'],
  },

  {
    title: 'Easy Dinner Recipes for the Whole Family',
    excerpt:
      'Simple dinner ideas that are easy to prepare and suitable for busy families.',
    content: `
      <h2>Simple Family Dinners</h2>
      <p>Family dinners do not need to involve complicated recipes.</p>
      <p>One-pot pasta, roasted vegetables, grilled chicken and rice bowls can provide satisfying meals without spending hours in the kitchen.</p>
      <h3>Plan Your Meals</h3>
      <p>Planning several meals in advance can make grocery shopping easier and reduce food waste.</p>
    `,
    tags: ['dinner', 'family', 'recipes', 'food'],
  },

  {
    title: 'Exploring the Future of Food Technology',
    excerpt:
      'Technology is changing how food is produced, prepared and delivered around the world.',
    content: `
      <h2>Technology Meets Food</h2>
      <p>Food technology is developing rapidly, from automated kitchens to alternative proteins and smart farming.</p>
      <p>Restaurants are increasingly using technology to improve ordering, inventory management and customer experiences.</p>
      <h3>What Comes Next?</h3>
      <p>Future food systems may rely more heavily on automation, sustainable production and personalized nutrition.</p>
    `,
    tags: ['food technology', 'innovation', 'future', 'food'],
  },

  // =========================================================
  // TECH - 10 POSTS
  // =========================================================

  {
    title: 'The Evolution of Modern Web Development',
    excerpt:
      'Web development has evolved rapidly with modern frameworks, cloud platforms and powerful browser technologies.',
    content: `
      <h2>Modern Web Development</h2>
      <p>Web development has changed significantly over the last decade.</p>
      <p>Modern applications often use component-based frontend frameworks, API-driven backends and cloud infrastructure.</p>
      <h3>The Developer Experience</h3>
      <p>Tools such as Git, automated testing, containers and continuous integration have made development workflows more efficient.</p>
    `,
    tags: ['web development', 'programming', 'software', 'technology'],
  },

  {
    title: 'Why Cloud Computing Has Become Essential',
    excerpt:
      'Cloud computing provides organizations with scalable infrastructure and flexible software services.',
    content: `
      <h2>The Cloud Revolution</h2>
      <p>Cloud computing allows organizations to access computing resources without maintaining all infrastructure themselves.</p>
      <p>Cloud platforms provide storage, databases, networking and computing resources that can scale according to demand.</p>
      <h3>Benefits</h3>
      <p>Scalability, flexibility and reduced infrastructure management are among the major advantages of cloud computing.</p>
    `,
    tags: ['cloud', 'aws', 'azure', 'technology'],
  },

  {
    title: 'Understanding APIs for Modern Applications',
    excerpt:
      'APIs allow different software systems to communicate and exchange data efficiently.',
    content: `
      <h2>What Is an API?</h2>
      <p>An application programming interface provides a structured way for software systems to communicate.</p>
      <p>REST APIs are widely used by web and mobile applications to exchange data through HTTP requests.</p>
      <h3>Why APIs Matter</h3>
      <p>APIs allow frontend applications, backend services and external platforms to work together without exposing their internal implementation.</p>
    `,
    tags: ['api', 'rest', 'backend', 'programming'],
  },

  {
    title: 'A Beginner Guide to Docker Containers',
    excerpt:
      'Docker containers make it easier to package applications and run them consistently across environments.',
    content: `
      <h2>Getting Started with Docker</h2>
      <p>Docker packages an application and its dependencies into a portable container.</p>
      <p>This approach helps developers avoid the common problem of applications behaving differently across machines.</p>
      <h3>Containers and Images</h3>
      <p>A Docker image contains the instructions and dependencies needed to create a container.</p>
      <p>Containers can then be started, stopped and deployed consistently across environments.</p>
    `,
    tags: ['docker', 'containers', 'devops', 'technology'],
  },

  {
    title: 'How Cybersecurity Protects Modern Businesses',
    excerpt:
      'Cybersecurity has become essential as businesses increasingly depend on digital systems and online services.',
    content: `
      <h2>The Importance of Cybersecurity</h2>
      <p>Modern businesses store valuable information in digital systems, making security a critical priority.</p>
      <p>Strong authentication, encryption, monitoring and regular security updates can reduce many common risks.</p>
      <h3>Security Culture</h3>
      <p>Technology alone cannot guarantee security. Employees must also understand common threats such as phishing and social engineering.</p>
    `,
    tags: ['cybersecurity', 'security', 'business', 'technology'],
  },

  {
    title: 'The Growing Importance of Software Testing',
    excerpt:
      'Software testing helps teams identify defects and build more reliable applications.',
    content: `
      <h2>Why Testing Matters</h2>
      <p>Testing is an important part of professional software development.</p>
      <p>Unit tests, integration tests and end-to-end tests can help developers identify problems before applications reach users.</p>
      <h3>Continuous Testing</h3>
      <p>Modern development teams increasingly integrate automated tests into their continuous integration pipelines.</p>
    `,
    tags: ['software testing', 'qa', 'development', 'technology'],
  },

  {
    title: 'React and the Future of Frontend Development',
    excerpt:
      'Component-based frontend development continues to shape how modern web applications are built.',
    content: `
      <h2>Component-Based Applications</h2>
      <p>Modern frontend frameworks have made it easier to build complex interfaces from reusable components.</p>
      <p>React remains widely used for creating interactive web applications.</p>
      <h3>Reusable Architecture</h3>
      <p>Reusable components can improve consistency and reduce duplicated code across large applications.</p>
    `,
    tags: ['react', 'frontend', 'javascript', 'web development'],
  },

  {
    title: 'Why Databases Are the Foundation of Applications',
    excerpt:
      'Databases provide reliable ways to store, organize and retrieve application data.',
    content: `
      <h2>The Role of Databases</h2>
      <p>Almost every modern application needs a database to store information.</p>
      <p>Relational databases organize data using tables, while document databases such as MongoDB store flexible document structures.</p>
      <h3>Choosing a Database</h3>
      <p>The right database depends on the application's data model, scalability requirements and consistency needs.</p>
    `,
    tags: ['database', 'mongodb', 'sql', 'technology'],
  },

  {
    title: 'Understanding Microservices Architecture',
    excerpt:
      'Microservices divide large applications into smaller independently deployable services.',
    content: `
      <h2>What Are Microservices?</h2>
      <p>Microservices architecture organizes an application as a collection of small services.</p>
      <p>Each service can focus on a specific business capability and communicate with other services through APIs or messaging systems.</p>
      <h3>Advantages and Challenges</h3>
      <p>Microservices can improve scalability and independent deployment, but they also introduce distributed-system complexity.</p>
    `,
    tags: ['microservices', 'architecture', 'backend', 'cloud'],
  },

  {
    title: 'The Role of Open Source in Technology',
    excerpt:
      'Open source software has become a major driver of innovation across the technology industry.',
    content: `
      <h2>Open Source Innovation</h2>
      <p>Open source projects allow developers around the world to collaborate on software.</p>
      <p>Many technologies used by modern companies are built on open source foundations.</p>
      <h3>Community Collaboration</h3>
      <p>Open source communities provide opportunities to learn, contribute and improve software collaboratively.</p>
    `,
    tags: ['open source', 'software', 'programming', 'technology'],
  },

  // =========================================================
  // BUSINESS - 10 POSTS
  // =========================================================

  {
    title: 'How Small Businesses Can Build a Strong Online Presence',
    excerpt:
      'A strong digital presence can help small businesses reach customers and compete in modern markets.',
    content: `
      <h2>Building an Online Presence</h2>
      <p>Customers increasingly discover businesses through search engines, social media and online reviews.</p>
      <p>A professional website and consistent online branding can help establish credibility.</p>
      <h3>Start With the Basics</h3>
      <p>Businesses should clearly communicate their services, contact information and value proposition online.</p>
    `,
    tags: ['business', 'marketing', 'small business', 'digital'],
  },

  {
    title: 'Five Habits of Successful Entrepreneurs',
    excerpt:
      'Successful entrepreneurs often develop habits that help them stay focused and adaptable.',
    content: `
      <h2>Entrepreneurial Habits</h2>
      <p>Entrepreneurship requires persistence, adaptability and a willingness to learn.</p>
      <p>Successful founders often prioritize their most important tasks and continuously evaluate their decisions.</p>
      <h3>Keep Learning</h3>
      <p>Markets change quickly, so entrepreneurs must remain open to new ideas and feedback.</p>
    `,
    tags: ['entrepreneurship', 'startup', 'business', 'success'],
  },

  {
    title: 'Why Customer Experience Matters More Than Ever',
    excerpt:
      'Customer experience can strongly influence loyalty, reputation and long-term business growth.',
    content: `
      <h2>Customer Experience</h2>
      <p>Customers have more choices than ever before, making a positive experience an important competitive advantage.</p>
      <p>Fast support, clear communication and reliable products can build trust.</p>
      <h3>Listen to Customers</h3>
      <p>Businesses should actively collect feedback and use it to improve their products and services.</p>
    `,
    tags: ['customer experience', 'business', 'customers', 'growth'],
  },

  {
    title: 'How Startups Can Manage Their Limited Resources',
    excerpt:
      'Effective resource management is critical for startups operating with limited budgets and small teams.',
    content: `
      <h2>Managing Startup Resources</h2>
      <p>Startups often have limited money, employees and time.</p>
      <p>Prioritizing the most valuable activities can help teams avoid wasting resources.</p>
      <h3>Focus on the Core Product</h3>
      <p>Early-stage companies should focus on solving a clear customer problem before expanding into too many areas.</p>
    `,
    tags: ['startup', 'business', 'management', 'entrepreneurship'],
  },

  {
    title: 'The Importance of Digital Marketing for Modern Companies',
    excerpt:
      'Digital marketing gives businesses new ways to reach targeted audiences and measure campaign performance.',
    content: `
      <h2>Digital Marketing Today</h2>
      <p>Digital marketing includes search engines, social media, email marketing and online advertising.</p>
      <p>One of its major advantages is the ability to measure results and adjust campaigns based on data.</p>
      <h3>Know Your Audience</h3>
      <p>Understanding customer needs and behavior helps businesses create more relevant marketing campaigns.</p>
    `,
    tags: ['digital marketing', 'marketing', 'business', 'seo'],
  },

  {
    title: 'How Data Helps Businesses Make Better Decisions',
    excerpt:
      'Data-driven decision making allows companies to understand customers, operations and market trends.',
    content: `
      <h2>Business Decisions and Data</h2>
      <p>Businesses generate large amounts of data through sales, customer interactions and operations.</p>
      <p>Analyzing this information can reveal patterns that would otherwise be difficult to identify.</p>
      <h3>Use Data Carefully</h3>
      <p>Good decisions require both reliable data and human judgment.</p>
    `,
    tags: ['data', 'business intelligence', 'analytics', 'business'],
  },

  {
    title: 'Leadership Lessons for Growing Teams',
    excerpt:
      'Strong leadership becomes increasingly important as organizations grow and responsibilities expand.',
    content: `
      <h2>Leading Growing Teams</h2>
      <p>Leadership is not simply about giving instructions. Effective leaders help teams understand goals and remove obstacles.</p>
      <p>Clear communication and trust can improve collaboration.</p>
      <h3>Empower Employees</h3>
      <p>Giving team members ownership of meaningful work can increase motivation and accountability.</p>
    `,
    tags: ['leadership', 'management', 'business', 'teams'],
  },

  {
    title: 'The Benefits of Building a Strong Business Brand',
    excerpt:
      'A consistent brand helps businesses become recognizable and build trust with customers.',
    content: `
      <h2>Why Branding Matters</h2>
      <p>A brand represents more than a logo. It includes the experience customers associate with a company.</p>
      <p>Consistent messaging, design and customer service can strengthen brand recognition.</p>
      <h3>Build Trust</h3>
      <p>Strong brands communicate clearly and consistently across different channels.</p>
    `,
    tags: ['branding', 'business', 'marketing', 'strategy'],
  },

  {
    title: 'How Remote Work Is Changing Business Operations',
    excerpt:
      'Remote work has changed how companies recruit employees, communicate and organize their operations.',
    content: `
      <h2>The Remote Work Era</h2>
      <p>Remote work allows companies to recruit talent from wider geographic areas.</p>
      <p>However, remote teams need effective communication systems and clear processes.</p>
      <h3>Building Remote Culture</h3>
      <p>Regular communication, documentation and trust are important for successful distributed teams.</p>
    `,
    tags: ['remote work', 'business', 'management', 'workplace'],
  },

  {
    title: 'What Makes a Business Model Sustainable',
    excerpt:
      'A sustainable business model balances customer value, revenue generation and long-term operating costs.',
    content: `
      <h2>Understanding Business Models</h2>
      <p>A business model explains how a company creates value for customers and generates revenue.</p>
      <p>Successful businesses need to understand both customer needs and the economics of delivering their products.</p>
      <h3>Think Long Term</h3>
      <p>Sustainable growth usually requires careful planning rather than focusing only on short-term revenue.</p>
    `,
    tags: ['business model', 'strategy', 'startup', 'business'],
  },

  // =========================================================
  // CRYPTO - 10 POSTS
  // =========================================================

  {
    title: 'Understanding Blockchain Technology',
    excerpt:
      'Blockchain is a distributed technology that allows participants to maintain a shared record of transactions.',
    content: `
      <h2>What Is Blockchain?</h2>
      <p>A blockchain is a distributed ledger where records are grouped into blocks and linked together.</p>
      <p>Participants in a network can verify transactions without relying on a single central database.</p>
      <h3>Beyond Cryptocurrency</h3>
      <p>Blockchain technology can also be used for applications involving digital ownership, supply chains and decentralized systems.</p>
    `,
    tags: ['blockchain', 'crypto', 'web3', 'technology'],
  },

  {
    title: 'What Is Bitcoin and How Does It Work',
    excerpt:
      'Bitcoin is a decentralized digital currency that operates using blockchain technology.',
    content: `
      <h2>Bitcoin Explained</h2>
      <p>Bitcoin is a digital currency designed to operate without a central monetary authority.</p>
      <p>Transactions are recorded on a public blockchain and verified by participants in the network.</p>
      <h3>Digital Scarcity</h3>
      <p>The Bitcoin protocol limits the total number of bitcoins that can eventually exist.</p>
    `,
    tags: ['bitcoin', 'crypto', 'blockchain', 'digital currency'],
  },

  {
    title: 'A Beginner Guide to Cryptocurrency Wallets',
    excerpt:
      'Crypto wallets provide ways to manage the keys needed to interact with blockchain assets.',
    content: `
      <h2>Understanding Crypto Wallets</h2>
      <p>A cryptocurrency wallet does not simply store coins like a traditional physical wallet. It manages cryptographic keys used to interact with blockchain networks.</p>
      <p>Wallets can be software-based, hardware-based or integrated into other applications.</p>
      <h3>Protect Your Keys</h3>
      <p>Private keys and recovery phrases should be protected carefully because losing them can result in losing access to assets.</p>
    `,
    tags: ['crypto wallet', 'bitcoin', 'security', 'crypto'],
  },

  {
    title: 'Smart Contracts Explained for Beginners',
    excerpt:
      'Smart contracts are programs stored on blockchain networks that can execute predefined rules.',
    content: `
      <h2>What Are Smart Contracts?</h2>
      <p>Smart contracts are programs that execute actions when specified conditions are met.</p>
      <p>They can be used to create decentralized applications and automate agreements.</p>
      <h3>Smart Contract Applications</h3>
      <p>Decentralized finance, digital collectibles and many Web3 applications use smart contracts.</p>
    `,
    tags: ['smart contracts', 'ethereum', 'blockchain', 'web3'],
  },

  {
    title: 'The Growth of Decentralized Finance',
    excerpt:
      'Decentralized finance aims to provide financial services through blockchain-based applications.',
    content: `
      <h2>Decentralized Finance</h2>
      <p>Decentralized finance, commonly called DeFi, uses blockchain technology to provide financial services through software protocols.</p>
      <p>Users can interact with decentralized applications without relying on traditional financial intermediaries for every transaction.</p>
      <h3>Risks and Opportunities</h3>
      <p>DeFi can introduce new financial possibilities, but users must also understand smart contract, liquidity and market risks.</p>
    `,
    tags: ['defi', 'crypto', 'blockchain', 'finance'],
  },

  {
    title: 'What Is Web3 and Why Does It Matter',
    excerpt:
      'Web3 describes a vision of internet applications that use decentralized technologies and user-owned digital assets.',
    content: `
      <h2>Understanding Web3</h2>
      <p>Web3 is commonly associated with blockchain-based applications and decentralized ownership.</p>
      <p>Instead of relying entirely on centralized platforms, Web3 applications can use distributed networks and smart contracts.</p>
      <h3>A Developing Ecosystem</h3>
      <p>The Web3 ecosystem continues to evolve as developers explore new approaches to digital identity, ownership and online communities.</p>
    `,
    tags: ['web3', 'crypto', 'blockchain', 'decentralization'],
  },

  {
    title: 'How Blockchain Could Change Digital Identity',
    excerpt:
      'Blockchain-based identity systems could provide new ways to manage and verify digital credentials.',
    content: `
      <h2>Digital Identity on Blockchain</h2>
      <p>Digital identity is an important area of research in blockchain technology.</p>
      <p>Decentralized identity systems aim to give individuals more control over their credentials and identity information.</p>
      <h3>Privacy Considerations</h3>
      <p>Any identity solution must carefully consider privacy, security and user control.</p>
    `,
    tags: ['digital identity', 'blockchain', 'web3', 'privacy'],
  },

  {
    title: 'Understanding Crypto Market Volatility',
    excerpt:
      'Cryptocurrency markets can experience significant price movements influenced by many factors.',
    content: `
      <h2>Why Crypto Prices Move</h2>
      <p>Cryptocurrency prices can change quickly because markets are influenced by supply, demand, sentiment and broader economic conditions.</p>
      <p>News, regulations and technological developments can also influence market behavior.</p>
      <h3>Risk Awareness</h3>
      <p>Anyone studying digital assets should understand that cryptocurrency markets can be highly volatile.</p>
    `,
    tags: ['crypto', 'markets', 'bitcoin', 'finance'],
  },

  {
    title: 'The Role of Ethereum in the Crypto Ecosystem',
    excerpt:
      'Ethereum provides a programmable blockchain platform used by decentralized applications and smart contracts.',
    content: `
      <h2>Ethereum Explained</h2>
      <p>Ethereum is a blockchain platform designed to support programmable applications.</p>
      <p>Its smart contract capabilities have enabled a large ecosystem of decentralized applications.</p>
      <h3>Beyond Currency</h3>
      <p>Unlike blockchains focused primarily on digital payments, Ethereum is widely used as a platform for programmable decentralized systems.</p>
    `,
    tags: ['ethereum', 'crypto', 'smart contracts', 'blockchain'],
  },

  {
    title: 'The Future of Blockchain Technology',
    excerpt:
      'Blockchain development continues to explore scalability, interoperability and real-world applications.',
    content: `
      <h2>Where Blockchain Is Going</h2>
      <p>Blockchain developers continue to work on improving scalability, security and usability.</p>
      <p>Future applications may involve financial systems, digital identity, supply chains and decentralized infrastructure.</p>
      <h3>Challenges Remain</h3>
      <p>For blockchain to reach wider adoption, usability, regulation and technical scalability will remain important challenges.</p>
    `,
    tags: ['blockchain', 'future', 'crypto', 'technology'],
  },

  // =========================================================
  // AI - 10 POSTS
  // =========================================================

  {
    title: 'What Is Artificial Intelligence',
    excerpt:
      'Artificial intelligence enables computer systems to perform tasks that traditionally require human intelligence.',
    content: `
      <h2>Understanding Artificial Intelligence</h2>
      <p>Artificial intelligence is a broad field focused on creating systems that can perform tasks involving reasoning, learning, perception or decision making.</p>
      <p>Modern AI includes machine learning, natural language processing, computer vision and generative systems.</p>
      <h3>AI in Everyday Life</h3>
      <p>AI is already used in search engines, recommendation systems, navigation applications and many business processes.</p>
    `,
    tags: ['ai', 'artificial intelligence', 'technology', 'machine learning'],
  },

  {
    title: 'How Generative AI Is Changing Software Development',
    excerpt:
      'Generative AI tools are helping developers write, understand and test software more efficiently.',
    content: `
      <h2>AI and Software Development</h2>
      <p>Generative AI can assist developers with code generation, documentation, debugging and testing.</p>
      <p>These tools can accelerate development, but developers still need to review generated code carefully.</p>
      <h3>The Developer Role</h3>
      <p>Understanding software architecture and problem solving remains important even when AI tools are used during development.</p>
    `,
    tags: ['ai', 'software development', 'coding', 'generative ai'],
  },

  {
    title: 'Machine Learning Explained in Simple Terms',
    excerpt:
      'Machine learning allows computer systems to learn patterns from data instead of relying entirely on manually written rules.',
    content: `
      <h2>What Is Machine Learning?</h2>
      <p>Machine learning is a branch of artificial intelligence where algorithms learn patterns from data.</p>
      <p>Models can then use those learned patterns to make predictions or decisions on new data.</p>
      <h3>Common Applications</h3>
      <p>Machine learning powers recommendation systems, fraud detection, image recognition and many other applications.</p>
    `,
    tags: ['machine learning', 'ai', 'data science', 'technology'],
  },

  {
    title: 'How AI Is Transforming Customer Support',
    excerpt:
      'AI-powered assistants are changing how businesses handle common customer support requests.',
    content: `
      <h2>AI Customer Support</h2>
      <p>Businesses are increasingly using AI assistants to answer common questions and help customers navigate services.</p>
      <p>AI can handle repetitive requests while human agents focus on complex problems.</p>
      <h3>Finding the Balance</h3>
      <p>The best customer support systems combine automation with human assistance when customers need more personalized help.</p>
    `,
    tags: ['ai', 'customer support', 'automation', 'business'],
  },

  {
    title: 'The Importance of Data in Artificial Intelligence',
    excerpt:
      'High-quality data is one of the most important foundations for building useful AI systems.',
    content: `
      <h2>AI Needs Data</h2>
      <p>Machine learning systems depend heavily on the quality and relevance of their training data.</p>
      <p>Incomplete, inaccurate or biased data can affect the performance of AI systems.</p>
      <h3>Data Quality</h3>
      <p>Organizations building AI applications need processes for collecting, cleaning and evaluating data.</p>
    `,
    tags: ['ai', 'data', 'machine learning', 'technology'],
  },

  {
    title: 'AI Ethics and Responsible Technology',
    excerpt:
      'Responsible AI development requires attention to fairness, transparency, privacy and accountability.',
    content: `
      <h2>Responsible AI</h2>
      <p>As AI systems become more widely used, questions about fairness, privacy and accountability become increasingly important.</p>
      <p>Organizations should evaluate how their systems affect different groups of users.</p>
      <h3>Transparency Matters</h3>
      <p>Clear documentation and responsible development practices can help organizations identify and reduce potential risks.</p>
    `,
    tags: ['ai ethics', 'responsible ai', 'privacy', 'technology'],
  },

  {
    title: 'How Computer Vision Works',
    excerpt:
      'Computer vision enables machines to analyze and interpret information contained in images and videos.',
    content: `
      <h2>Understanding Computer Vision</h2>
      <p>Computer vision is a field of AI focused on enabling computers to understand visual information.</p>
      <p>Modern computer vision systems can classify images, detect objects and analyze visual patterns.</p>
      <h3>Real-World Applications</h3>
      <p>Computer vision is used in medical imaging, manufacturing, autonomous systems and security applications.</p>
    `,
    tags: ['computer vision', 'ai', 'machine learning', 'images'],
  },

  {
    title: 'Natural Language Processing in Everyday Applications',
    excerpt:
      'Natural language processing helps computers understand and generate human language.',
    content: `
      <h2>Understanding Human Language</h2>
      <p>Natural language processing, or NLP, allows computer systems to work with human language.</p>
      <p>NLP powers applications such as translation, search, chatbots and text analysis.</p>
      <h3>Language Models</h3>
      <p>Modern language models can generate and analyze text across many different tasks.</p>
    `,
    tags: ['nlp', 'ai', 'language models', 'technology'],
  },

  {
    title: 'The Future of AI-Powered Personal Assistants',
    excerpt:
      'AI assistants are becoming more capable of understanding context and helping users complete everyday tasks.',
    content: `
      <h2>The Next Generation of Assistants</h2>
      <p>AI assistants are moving beyond simple question answering toward systems that can help users complete multi-step tasks.</p>
      <p>They can potentially organize information, interact with software and provide personalized assistance.</p>
      <h3>Trust and Control</h3>
      <p>As assistants become more capable, reliability, privacy and user control will become increasingly important.</p>
    `,
    tags: ['ai assistants', 'artificial intelligence', 'automation', 'future'],
  },

  {
    title: 'How AI Is Changing the Future of Work',
    excerpt:
      'Artificial intelligence is changing how people perform tasks and how organizations design workflows.',
    content: `
      <h2>AI and the Workplace</h2>
      <p>AI can automate repetitive tasks and help employees analyze information more efficiently.</p>
      <p>The impact will differ across industries and occupations depending on the types of tasks involved.</p>
      <h3>Learning New Skills</h3>
      <p>Workers can prepare for changes by developing technical, analytical and communication skills that complement AI systems.</p>
    `,
    tags: ['ai', 'future of work', 'automation', 'business'],
  },
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');

    await connectDB();

    console.log('✅ Connected to MongoDB');

    // ---------------------------------------------------------
    // Find first user
    // ---------------------------------------------------------

    const author = await User.findOne().sort({ createdAt: 1 });

    if (!author) {
      throw new Error(
        'No users found in the database. Please create at least one user first.'
      );
    }

    console.log(`👤 Using first user as author: ${author.email || author._id}`);

    // ---------------------------------------------------------
    // Remove existing seed data
    // ---------------------------------------------------------

    const categoryNames = categoriesData.map((category) => category.name);

    const existingCategories = await Category.find({
      name: { $in: categoryNames },
    });

    const existingCategoryIds = existingCategories.map(
      (category) => category._id
    );

    if (existingCategoryIds.length > 0) {
      const deletedPosts = await Post.deleteMany({
        category: { $in: existingCategoryIds },
      });

      console.log(`🗑️ Removed ${deletedPosts.deletedCount} existing posts`);
    }

    await Category.deleteMany({
      name: { $in: categoryNames },
    });

    console.log('🗑️ Removed existing seed categories');

    // ---------------------------------------------------------
    // Create categories
    // ---------------------------------------------------------

    const categories = await Category.insertMany(categoriesData);

    console.log(`✅ Created ${categories.length} categories`);

    const categoryMap = {};

    categories.forEach((category) => {
      categoryMap[category.slug] = category._id;
    });

    // ---------------------------------------------------------
    // Create posts
    // ---------------------------------------------------------

    const categorySlugs = ['food', 'tech', 'business', 'crypto', 'ai'];

    const allPosts = [];

    let postIndex = 0;

    for (const categorySlug of categorySlugs) {
      const categoryId = categoryMap[categorySlug];

      const categoryPosts = postsData.filter((post) => {
        const index = postsData.indexOf(post);

        const startIndex = categorySlugs.indexOf(categorySlug) * 10;
        const endIndex = startIndex + 10;

        return index >= startIndex && index < endIndex;
      });

      for (const post of categoryPosts) {
        postIndex++;

        allPosts.push({
          ...post,

          category: categoryId,

          author: author._id,

          featuredImage: `https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&w=1200&q=80`,

          featuredImagePublicId: '',

          status: 'published',

          views: Math.floor(Math.random() * 5000),

          likes: [],

          bookmarks: [],

          metaTitle: post.title,

          metaDescription: post.excerpt,

          isFeatured: postIndex <= 5,

          isTrending: postIndex <= 10,
        });
      }
    }

    // ---------------------------------------------------------
    // Insert posts individually
    // ---------------------------------------------------------
    // We use create() instead of insertMany() because your Post
    // schema has a pre('save') hook that generates slug and
    // readingTime.

    for (const post of allPosts) {
      await Post.create(post);
    }

    console.log(`✅ Created ${allPosts.length} posts`);

    // ---------------------------------------------------------
    // Summary
    // ---------------------------------------------------------

    console.log('\n========================================');
    console.log('🎉 DATABASE SEED COMPLETED');
    console.log('========================================');
    console.log(`👤 Author: ${author.email || author._id}`);
    console.log('📂 Categories: 5');
    console.log('📝 Posts: 50');
    console.log('   🍔 Food:     10');
    console.log('   💻 Tech:     10');
    console.log('   💼 Business: 10');
    console.log('   ₿ Crypto:    10');
    console.log('   🤖 AI:       10');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ SEED ERROR');
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
