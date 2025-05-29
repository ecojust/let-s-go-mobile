import { Image, StyleSheet, Platform, FlatList, SafeAreaView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  // 示例列表数据
  const listData = [
    { id: '1', title: '项目 1' },
    { id: '2', title: '项目 2' },
    { id: '3', title: '项目 3' },
    { id: '4', title: '项目 4' },
    { id: '5', title: '项目 5' },
    { id: '6', title: '项目 6' },
    { id: '7', title: '项目 7' },
    { id: '8', title: '项目 8' },
    { id: '9', title: '项目 9' },
    { id: '10', title: '项目 10' },
    { id: '11', title: '项目 10' },
    { id: '12', title: '项目 10' },
    { id: '13', title: '项目 10' },
    { id: '14', title: '项目 10' },
    { id: '15', title: '项目 10' },
    { id: '16', title: '项目 10' },
    { id: '17', title: '项目 10' },

  ];

  // 渲染列表项
  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <ThemedView style={styles.listItem}>
      <ThemedText>{item.title}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.header}>列表界面</ThemedText>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
    borderColor: '#ccc',

  },
  container: {
    backgroundColor: 'rgb(141, 128, 128)',  // 半透明背景

    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 0 : 16, // 为Android设备增加顶部内边距
  },
  header: {
    backgroundColor: 'rgba(54, 45, 213, 0.5)',  // 半透明背景
    paddingTop: 8, // 增加标题的顶部外边距
    paddingBottom: 8, // 增加标题的底部外边距
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  listItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(220, 169, 16, 0.3)',  // 半透明背景


  },
});
