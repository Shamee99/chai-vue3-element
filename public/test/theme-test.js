/**
 * 主题测试脚本
 * 用于测试主题切换功能是否正常工作
 *
 * 使用方法：
 * 1. 在浏览器控制台中粘贴此脚本
 * 2. 运行 testThemeSwitching() 函数
 */

// 主题配置数据
const themeConfig = {
  themes: [
    {
      name: '默认蓝',
      key: 'default',
      colors: {
        '--el-color-primary': '#409eff',
        '--el-color-primary-light-3': '#79bbff',
        '--el-color-primary-light-5': '#a0cfff',
        '--el-color-primary-light-7': '#c6e2ff',
        '--el-color-primary-light-8': '#d9ecff',
        '--el-color-primary-light-9': '#ecf5ff',
        '--el-color-primary-dark-2': '#337ecc',
        '--sidebar-bg-color': '#001529',
        '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
        '--sidebar-active-bg': '#1890ff',
        '--sidebar-active-text': '#ffffff',
        '--page-bg-color': '#f0f2f5',
        '--header-bg-color': '#ffffff',
      },
    },
    {
      name: '天空蓝',
      key: 'sky',
      colors: {
        '--el-color-primary': '#1890ff',
        '--el-color-primary-light-3': '#5ac8ff',
        '--el-color-primary-light-5': '#85dcff',
        '--el-color-primary-light-7': '#b0eeff',
        '--el-color-primary-light-8': '#c4f5ff',
        '--el-color-primary-light-9': '#d9fbff',
        '--el-color-primary-dark-2': '#1373cc',
        '--sidebar-bg-color': '#0a1a3a',
        '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
        '--sidebar-active-bg': '#1890ff',
        '--sidebar-active-text': '#ffffff',
        '--page-bg-color': '#f0f5ff',
        '--header-bg-color': '#ffffff',
      },
    },
    {
      name: '翡翠绿',
      key: 'emerald',
      colors: {
        '--el-color-primary': '#52c41a',
        '--el-color-primary-light-3': '#7ed375',
        '--el-color-primary-light-5': '#a4e595',
        '--el-color-primary-light-7': '#c9f5b3',
        '--el-color-primary-light-8': '#daface2',
        '--el-color-primary-light-9': '#ebfbf0',
        '--el-color-primary-dark-2': '#429d15',
        '--sidebar-bg-color': '#002814',
        '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
        '--sidebar-active-bg': '#52c41a',
        '--sidebar-active-text': '#ffffff',
        '--page-bg-color': '#f0fff4',
        '--header-bg-color': '#ffffff',
      },
    },
  ],
};

/**
 * 获取当前 CSS 变量的值
 */
function getCSSVariables() {
  const root = document.documentElement;
  const computedStyle = window.getComputedStyle(root);

  return {
    '--el-color-primary': computedStyle.getPropertyValue('--el-color-primary').trim(),
    '--sidebar-bg-color': computedStyle.getPropertyValue('--sidebar-bg-color').trim(),
    '--sidebar-active-bg': computedStyle.getPropertyValue('--sidebar-active-bg').trim(),
    '--page-bg-color': computedStyle.getPropertyValue('--page-bg-color').trim(),
    '--header-bg-color': computedStyle.getPropertyValue('--header-bg-color').trim(),
  };
}

/**
 * 应用主题
 */
function applyTheme(themeKey) {
  const theme = themeConfig.themes.find((t) => t.key === themeKey);
  if (!theme) {
    console.error('❌ 主题不存在:', themeKey);
    return false;
  }

  console.log(`\n🎨 应用主题: ${theme.name} (${theme.key})`);

  const root = document.documentElement;
  let success = true;

  // 设置 CSS 变量
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
    console.log(`  ✅ ${property} = ${value}`);

    // 验证是否设置成功
    setTimeout(() => {
      const actualValue = root.style.getPropertyValue(property).trim();
      if (actualValue !== value) {
        console.error(`  ❌ ${property} 设置失败: 期望 ${value}, 实际 ${actualValue}`);
        success = false;
      }
    }, 100);
  });

  return success;
}

/**
 * 验证主题是否正确应用
 */
function verifyTheme(expectedThemeKey) {
  const expectedTheme = themeConfig.themes.find((t) => t.key === expectedThemeKey);
  if (!expectedTheme) {
    console.error('❌ 主题不存在:', expectedThemeKey);
    return false;
  }

  console.log(`\n🔍 验证主题: ${expectedTheme.name}`);

  const currentVars = getCSSVariables();
  let allMatch = true;

  Object.entries(expectedTheme.colors).forEach(([property, expectedValue]) => {
    // 先检查内联样式
    const inlineValue = document.documentElement.style.getPropertyValue(property).trim();
    // 再检查计算样式
    const computedValue = window.getComputedStyle(document.documentElement).getPropertyValue(property).trim();

    // 使用计算样式进行比较（因为内联样式可能被计算样式覆盖）
    const actualValue = computedValue || inlineValue;

    const isMatch = actualValue === expectedValue;
    const icon = isMatch ? '✅' : '❌';

    console.log(`  ${icon} ${property}:`);
    console.log(`      期望值: ${expectedValue}`);
    console.log(`      实际值: ${actualValue}`);
    console.log(`      内联值: ${inlineValue}`);
    console.log(`      计算值: ${computedValue}`);

    if (!isMatch) {
      allMatch = false;
    }
  });

  return allMatch;
}

/**
 * 检查元素样式
 */
function checkElementStyles() {
  console.log('\n🔍 检查元素样式...');

  // 检查侧边栏
  const sidebar = document.querySelector('.layout-sidebar');
  if (sidebar) {
    const sidebarStyle = window.getComputedStyle(sidebar);
    console.log(`\n📌 侧边栏:`);
    console.log(`  background-color: ${sidebarStyle.backgroundColor}`);
    console.log(`  width: ${sidebarStyle.width}`);
  } else {
    console.log('⚠️  未找到侧边栏元素');
  }

  // 检查主内容区
  const content = document.querySelector('.layout-content');
  if (content) {
    const contentStyle = window.getComputedStyle(content);
    console.log(`\n📌 主内容区:`);
    console.log(`  background-color: ${contentStyle.backgroundColor}`);
  } else {
    console.log('⚠️  未找到主内容区元素');
  }

  // 检查头部
  const header = document.querySelector('.layout-header');
  if (header) {
    const headerStyle = window.getComputedStyle(header);
    console.log(`\n📌 头部:`);
    console.log(`  background-color: ${headerStyle.backgroundColor}`);
  } else {
    console.log('⚠️  未找到头部元素');
  }

  // 检查菜单
  const menu = document.querySelector('.el-menu');
  if (menu) {
    const menuStyle = window.getComputedStyle(menu);
    console.log(`\n📌 菜单:`);
    console.log(`  background-color: ${menuStyle.backgroundColor}`);
  } else {
    console.log('⚠️  未找到菜单元素');
  }
}

/**
 * 测试主题切换
 */
function testThemeSwitching() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 开始主题切换测试');
  console.log('='.repeat(60));

  // 显示初始状态
  console.log('\n📋 初始状态:');
  const initialVars = getCSSVariables();
  console.log('  当前 CSS 变量:', initialVars);

  // 测试 1: 切换到天空蓝
  console.log('\n' + '-'.repeat(60));
  console.log('📝 测试 1: 切换到天空蓝主题');
  console.log('-'.repeat(60));
  const result1 = applyTheme('sky');
  setTimeout(() => {
    const verified1 = verifyTheme('sky');
    checkElementStyles();
    console.log(`\n${verified1 ? '✅' : '❌'} 测试 1 ${verified1 ? '通过' : '失败'}`);

    // 测试 2: 切换到翡翠绿
    console.log('\n' + '-'.repeat(60));
    console.log('📝 测试 2: 切换到翡翠绿主题');
    console.log('-'.repeat(60));
    const result2 = applyTheme('emerald');
    setTimeout(() => {
      const verified2 = verifyTheme('emerald');
      checkElementStyles();
      console.log(`\n${verified2 ? '✅' : '❌'} 测试 2 ${verified2 ? '通过' : '失败'}`);

      // 测试 3: 切换回默认
      console.log('\n' + '-'.repeat(60));
      console.log('📝 测试 3: 切换回默认主题');
      console.log('-'.repeat(60));
      const result3 = applyTheme('default');
      setTimeout(() => {
        const verified3 = verifyTheme('default');
        checkElementStyles();
        console.log(`\n${verified3 ? '✅' : '❌'} 测试 3 ${verified3 ? '通过' : '失败'}`);

        // 测试总结
        console.log('\n' + '='.repeat(60));
        console.log('📊 测试总结');
        console.log('='.repeat(60));
        console.log(`测试 1 (天空蓝): ${verified1 ? '✅ 通过' : '❌ 失败'}`);
        console.log(`测试 2 (翡翠绿): ${verified2 ? '✅ 通过' : '❌ 失败'}`);
        console.log(`测试 3 (默认蓝): ${verified3 ? '✅ 通过' : '❌ 失败'}`);
        console.log('\n'.repeat(60));
        console.log('🎉 测试完成！');
        console.log('='.repeat(60));
      }, 500);
    }, 1000);
  }, 1000);
}

/**
 * 快速主题切换测试
 */
function quickThemeTest() {
  console.log('\n🎨 快速主题切换测试');

  const testThemes = ['sky', 'emerald', 'default'];
  let index = 0;

  function next() {
    if (index < testThemes.length) {
      applyTheme(testThemes[index]);
      setTimeout(() => {
        verifyTheme(testThemes[index]);
        index++;
        setTimeout(next, 500);
      }, 500);
    } else {
      console.log('\n✅ 快速测试完成！');
    }
  }

  next();
}

/**
 * 检查主题初始化
 */
function checkThemeInit() {
  console.log('\n🔍 检查主题初始化');

  const vars = getCSSVariables();
  console.log('\n📊 当前 CSS 变量:');
  Object.entries(vars).forEach(([key, value]) => {
    const hasValue = value ? '✅' : '❌';
    console.log(`  ${hasValue} ${key}: ${value || '(未设置)'}`);
  });

  // 检查 localStorage
  const savedTheme = localStorage.getItem('chai-admin-theme');
  console.log(`\n📦 localStorage 中的主题: ${savedTheme || '(未保存)'}`);

  // 检查 Pinia store
  console.log('\n🏪 检查 Pinia store...');
  // 注意：这个需要在 Vue 组件上下文中运行
  if (window.__pinia) {
    console.log('  ✅ Pinia store 已初始化');
  } else {
    console.log('  ⚠️  无法访问 Pinia store');
  }
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
📖 主题测试脚本帮助

可用函数:

1. testThemeSwitching()
   完整的主题切换测试，包含验证和样式检查

2. quickThemeTest()
   快速主题切换测试，在 sky, emerald, default 之间切换

3. checkThemeInit()
   检查主题初始化状态

4. applyTheme(themeKey)
   手动应用指定的主题
   可用的主题键: 'default', 'sky', 'emerald'

5. verifyTheme(expectedThemeKey)
   验证指定的主题是否正确应用

6. getCSSVariables()
   获取当前 CSS 变量的值

7. checkElementStyles()
   检查页面元素的实际样式

示例:
  testThemeSwitching()  // 运行完整测试
  applyTheme('sky')      // 应用天空蓝主题
  verifyTheme('sky')     // 验证天空蓝主题
  quickThemeTest()      // 快速测试

注意:
  - 此脚本需要在浏览器控制台中运行
  - 确保页面已完全加载
  - 建议在开发者工具中查看详细的日志输出
  `);
}

// 自动显示帮助信息
console.log('🎨 主题测试脚本已加载！');
console.log('💡 输入 showHelp() 查看可用命令');
console.log('💡 输入 testThemeSwitching() 开始测试');
