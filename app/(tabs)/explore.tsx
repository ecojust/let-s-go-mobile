import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  // 用户信息
  const userInfo = {
    name: "张三",
    avatar: require('@/assets/images/react-logo.png'), // 使用现有图片作为示例头像
    // 可以添加更多用户信息
  };

  // 设置选项列表
  const settingOptions = [
    { id: '1', title: '个人资料', icon: 'person.fill' },
    { id: '2', title: '账号安全', icon: 'lock.fill' },
    { id: '3', title: '通知设置', icon: 'bell.fill' },
    { id: '4', title: '隐私设置', icon: 'hand.raised.fill' },
    { id: '5', title: '主题设置', icon: 'paintbrush.fill' },
    { id: '6', title: '关于我们', icon: 'info.circle.fill' },
    { id: '7', title: '退出登录', icon: 'arrow.right.square.fill' },
  ];

  // 渲染设置选项
  const renderSettingItem = (item: { id: string; title: string; icon: string }) => (
    <TouchableOpacity key={item.id} style={styles.settingItem}>
      <ThemedText style={styles.settingText}>{item.title}</ThemedText>
      <IconSymbol name="chevron.right" size={20} color="#808080" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedView style={styles.headerImageContainer}>
          <Image source={userInfo.avatar} style={styles.avatarImage} />
        </ThemedView>
      }>
      <ThemedView style={styles.userInfoContainer}>
        <ThemedText type="title" style={styles.userName}>{userInfo.name}</ThemedText>
        <ThemedText style={styles.userDesc}>个人中心</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.settingsContainer}>
        <ThemedText style={styles.sectionTitle}>设置</ThemedText>
        {settingOptions.map(renderSettingItem)}
      </ThemedView>
      
      <ThemedView style={styles.versionContainer}>
        <ThemedText style={styles.versionText}>版本号: 1.0.0</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 0, 221, 0.2)',  // 内容区域背景色

  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(157, 255, 0, 0.2)',  // 内容区域背景色

  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',  // 内容区域背景色

  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: 'rgba(172, 14, 14, 0.2)',  // 内容区域背景色

  },
  userDesc: {
    fontSize: 16,
    color: '#808080',

    backgroundColor: 'rgba(4, 255, 0, 0.2)',  // 内容区域背景色

  },
  settingsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,

    backgroundColor: 'rgba(47, 0, 255, 0.2)',  // 内容区域背景色

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#808080',
  },
});
