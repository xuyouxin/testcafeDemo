import {Selector} from 'testcafe';

fixture`travis test`
    .page`https://develop-rcui.fiji.gliprc.com/?path=/story/tooltip--tooltipe`;

const section = Selector('.container').find('section').nth(0);

test('test one', async t => {

    await setTimeout(()=> {}, 1000);
    let children = section.child('a');
    let count = await children.count;
    console.log("count>>", count)

    for (let i = 0; i < count; i++) {
        await show(await children.nth(i), t, i, true);
    }

    // await t.debug();
    console.log('finish')
});

async function show(current, t, index, inSection) {

    let tagName = await current.tagName;
    if (tagName != 'section' && tagName != 'a' && tagName != 'div') {
        return;
    }
    if (tagName == 'a') {
        let title = await current.getAttribute("title");
        console.log(title)

        if (inSection) {
            //点击它，然后看它的下一个兄弟元素（Avatar默认就有显示，不需要点击）
            if (title != 'Avatar') {
                await t.click(current, {speed: 0.9});
            }
            await show(await section.child('div').nth(index), t, 0, false);
        } else {
            //a标签下面也可能嵌套其他菜单
            await t.click(current, {speed: 0.9});
            let children = await current.child('div');
            let count = await children.count;
            if (count > 0) {
                console.log("count>>", count)

                for (let i = 0; i < count; i++) {
                    await show(await children.nth(i), t, i, false);
                }
            }
        }

    } else {
        // await t.click(current, {speed: 0.9});
        let children = await current.child();
        let count = await children.count;
        console.log("count>>", count)

        for (let i = 0; i < count; i++) {
            await show(await children.nth(i), t, i, false);
        }
    }

}